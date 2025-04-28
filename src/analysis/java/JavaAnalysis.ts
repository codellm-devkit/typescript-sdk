/**
 * Copyright IBM Corporation 2025
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from "path";
import fg from "fast-glob";
import fs from "fs";
import { spawnSync } from "node:child_process";
import { JApplication, JCompilationUnit } from "../../models/java";
import * as types from "../../models/java/types";
import { JType } from "../../models/java";
import os from "os";
import JSONStream from "JSONStream";
declare module "JSONStream";
import crypto from "crypto";
import { createLogger } from "src/utils";

const logger = createLogger("JavaAnalysis");

enum AnalysisLevel {
  SYMBOL_TABLE = "1",
  CALL_GRAPH = "2",
  SYSTEM_DEPENDENCY_GRAPH = "3",
}

const analysisLevelMap: Record<string, AnalysisLevel> = {
  "symbol table": AnalysisLevel.SYMBOL_TABLE,
  "call graph": AnalysisLevel.CALL_GRAPH,
  "system dependency graph": AnalysisLevel.SYSTEM_DEPENDENCY_GRAPH,
};

export class JavaAnalysis {
  private readonly projectDir: string | null;
  private analysisLevel: AnalysisLevel;
  application?: types.JApplicationType;

  constructor(options: { projectDir: string | null; analysisLevel: string }) {
    this.projectDir = options.projectDir;
    this.analysisLevel = analysisLevelMap[options.analysisLevel.toLowerCase()] ?? AnalysisLevel.SYMBOL_TABLE;
  }

  private getCodeAnalyzerExec(): string[] {
    const codeanalyzerJarPath = path.resolve(__dirname, "jars");
    const pattern = path.join(codeanalyzerJarPath, "**/codeanalyzer-*.jar").replace(/\\/g, "/");
    const matches = fg.sync(pattern);
    const jarPath = matches[0];

    if (!jarPath) {
      logger.error("Default codeanalyzer jar not found.");
      throw new Error("Default codeanalyzer jar not found.");
    }
    logger.info("Codeanalyzer jar found at:", jarPath);
    return ["java", "-jar", jarPath];
  }

  /**
   * Initialize the application by running the codeanalyzer and parsing the output.
   * @private
   * @returns {Promise<types.JApplicationType>} A promise that resolves to the parsed application data
   * @throws {Error} If the project directory is not specified or if codeanalyzer fails
   */
  private async _initialize_application(): Promise<types.JApplicationType> {
    return new Promise<types.JApplicationType>((resolve, reject) => {
      if (!this.projectDir) {
        return reject(new Error("Project directory not specified"));
      }

      const projectPath = path.resolve(this.projectDir);
      // Create a temporary file to store the codeanalyzer output
      const tmpFilePath = path.join(os.tmpdir(), `${Date.now()}-${crypto.randomUUID()}`);
      const command = [
        ...this.getCodeAnalyzerExec(),
        "--input",
        projectPath,
        "--output",
        tmpFilePath,
        `--analysis-level=${this.analysisLevel}`,
        "--verbose",
      ];
      // Check if command is valid
      if (!command[0]) {
        return reject(new Error("Codeanalyzer command not found"));
      }
      logger.debug(command.join(" "));
      const result = spawnSync(command[0], command.slice(1), {
        stdio: ["ignore", "pipe", "inherit"],
      });

      if (result.error) {
        return reject(result.error);
      }

      if (result.status !== 0) {
        return reject(new Error("Codeanalyzer failed to run."));
      }

      // Read the analysis result from the temporary file
      try {
        const stream = fs.createReadStream(path.join(tmpFilePath, "analysis.json")).pipe(JSONStream.parse());
        const result = {} as types.JApplicationType;

        stream.on("data", (data: unknown) => {
          Object.assign(result, JApplication.parse(data));
        });

        stream.on("end", () => {
          // Clean up the temporary file
          logger.debug(`Deleting temporary file: ${tmpFilePath}`);
          fs.rm(tmpFilePath, { recursive: true, force: true }, (err) => {
            if (err) logger.warn(`Failed to delete temporary file: ${tmpFilePath}`, err);
          });
          resolve(result as types.JApplicationType);
        });

        stream.on("error", (err: any) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get the application data. This method returns the parsed Java application as a JSON structure containing the
   * following information:
   * |_ symbol_table: A record of file paths to compilation units. Each compilation unit further contains:
   *   |_ comments: Top-level file comments
   *   |_ imports: All import statements
   *   |_ type_declarations: All class/interface/enum/record declarations with their:
   *     |_ fields, methods, constructors, initialization blocks, etc.
   * |_ call_graph: Method-to-method call relationships (if analysis level ≥ 2)
   * |_ system_dependency_graph: System component dependencies (if analysis level = 3)
   *
   * The application view denoted by this application structure is crucial for further fine-grained analysis APIs.
   * If the application is not already initialized, it will be initialized first.
   * @returns {Promise<types.JApplicationType>} A promise that resolves to the application data
   */
  public async getApplication(): Promise<types.JApplicationType> {
    if (!this.application) {
      this.application = await this._initialize_application();
    }
    return this.application;
  }

  /**
   * Get the symbol table from the application.
   * @returns {Promise<Record<string, types.JCompilationUnitType>>} A promise that resolves to a record of file paths and their
   * corresponding {@link JCompilationUnitType} objects
   * 
   * @notes This method retrieves the symbol table from the application, which contains information about all
   * compilation units in the Java application. The returned record contains file paths as keys and their
   * corresponding {@link JCompilationUnit} objects as values.
   */
  public async getSymbolTable(): Promise<Record<string, types.JCompilationUnitType>> {
    return (await this.getApplication()).symbol_table;
  }

  /**
   * Get all classes in the application.
   * @returns {Promise<Record<string, types.JTypeType>>} A promise that resolves to a record of class names and their
   * corresponding {@link JTypeType} objects
   *
   * @notes This method retrieves all classes from the symbol table and returns them as a record. The returned record
   *       contains class names as keys and their corresponding {@link JType} objects as values.
   */
  public async getAllClasses(): Promise<Record<string, types.JTypeType>> {
    return Object.values(await this.getSymbolTable()).reduce((classAccumulator, symbol) => {
      Object.entries(symbol.type_declarations).forEach(([key, value]) => {
        classAccumulator[key] = value;
      });
      return classAccumulator;
    }, {} as Record<string, types.JTypeType>);
  }

  /**
   * Get a specific class by its qualified name.
   * @param {string} qualifiedName - The qualified name of the class to retrieve
   * @returns {Promise<types.JTypeType>} A promise that resolves to the {@link JTypeType} object representing the class
   * @throws {Error} If the class is not found in the application
   * 
   * @notes This method retrieves a specific class from the application by its qualified name. If the class is found,
   *       it returns the corresponding {@link JType} object. If the class is not found, it throws an error.
   */
  public async getClassByQualifiedName(qualifiedName: string): Promise<types.JTypeType> {
    const allClasses = await this.getAllClasses();
    if (allClasses[qualifiedName]) {
      return allClasses[qualifiedName];
    }
    else
      throw new Error(`Class ${qualifiedName} not found in the application.`);
  }

  /**
  * Get all methods in the application.
  * @returns {Promise<Record<string, Record<string, types.JCallableType>>>} A promise that resolves to a record of
  * method names and their corresponding {@link JCallableType} objects
  * 
  * @notes This method retrieves all methods from the symbol table and returns them as a record. The returned
  *       record contains class names as keys and their corresponding {@link JCallableType} objects as values.
  *       Each {@link JCallableType} object contains information about the method's parameters, return type, and
  *       other relevant details.
  */
  public async getAllMethods(): Promise<Record<string, Record<string, types.JCallableType>>> {
    return Object.entries(await this.getAllClasses()).reduce((allMethods, [key, value]) => {
      allMethods[key] = value.callable_declarations;
      return allMethods;
    }, {} as Record<string, Record<string, types.JCallableType>>);
  }

  /**
   * Get all methods in a specific class in the application.
   * @returns {Promise<Record<string, Record<string, types.JCallableType>>>} A promise that resolves to a record of
   * method names and their corresponding {@link JCallableType} objects
   * 
   * @notes This method retrieves all methods from the symbol table and returns them as a record. The returned
   *       record contains class names as keys and their corresponding {@link JCallableType} objects as values.
   *       Each {@link JCallableType} object contains information about the method's parameters, return type, and
   *       other relevant details.
   */
  public async getAllMethodsByClass(qualifiedName: string): Promise<Array<types.JCallableType>> {
    const classForWhichMethodsAreRequested = await this.getClassByQualifiedName(qualifiedName);
    return classForWhichMethodsAreRequested ? Object.values(classForWhichMethodsAreRequested.callable_declarations ?? {}) : [];
  }

  /**
   * Get a specific methods within a specific class by its qualified name.
   * @param {string} qualifiedName - The qualified name of the class to retrieve
   * @param {string} methodName - The name of the method to retrieve
   * @returns {Promise<types.JCallableType>} A promise that resolves to the {@link JCallable} object representing the method.
   * @throws {Error} If the class or method is not found in the application.
   * 
   * @notes This method retrieves a specific method from the application by its qualified name and method name.
   * If the method is found, it returns the corresponding {@link JCallableType} object. If the method is not found,
   * it throws an error.
   */
  public async getMethodByQualifiedName(qualifiedName: string, methodName: string): Promise<types.JCallableType> {
    return (await this.getAllMethodsByClass(qualifiedName)).find(
      (method) => method.signature === methodName
    ) ?? (() => { throw new Error(`Method ${methodName} not found in class ${qualifiedName}.`); })();
  }

  /**
   * Get all the method parameters in a specific method within a specific class by its qualified name.
   * @param {string} qualifiedName - The qualified name of the class to retrieve
   * @param {string} methodName - The name of the method to retrieve
   * @returns {Promise<Array<types.JCallableParameterType>>} A promise that resolves to an array of {@link JCallableParameterType} objects
   * @throws {Error} If the class or method is not found in the application.
   * 
   * @notes This method retrieves all the parameters of a specific method from the application by its qualified name
   * and method name. If the method is found, it returns an array of {@link JCallableParameter} objects representing
   */
  public async getMethodParameters(qualifiedName: string, methodName: string): Promise<Array<types.JCallableParameterType>> {
    return (await this.getMethodByQualifiedName(qualifiedName, methodName)).parameters ?? [];
  }

  /**
   * Get all the method parameters in a specific method within a specific class by its callable object.
   * @param {types.JCallableType} callable - The callable object representing the method to retrieve
   * @returns {Promise<Array<types.JCallableParameterType>>} A promise that resolves to an array of {@link JCallableParameterType} objects
   * 
   * @notes This method retrieves all the parameters of a specific method from the application by its callable object.
   * If the method is found, it returns an array of {@link JCallableParameter} objects representing
   * the parameters of the method. Otherwise, it returns an empty array.
   */
  public async getMethodParametersFromCallable(callable: types.JCallableType): Promise<Array<types.JCallableParameterType>> {
    return callable.parameters ?? [];
  }

  /**
   * Get the java file path given the qualified name of the class.
   * @param {string} qualifiedName - The qualified name of the class to retrieve
   * @returns {Promise<string>} A promise that resolves to the file path of the Java file containing the class
   * @throws {Error} If the class is not found in the application.
   * 
   * @notes This method retrieves the file path of the Java file containing the class with the specified qualified name.
   * If the class is found, it returns the file path as a string. If the class is not found, it throws an error.
   */
  public async getJavaFilePathByQualifiedName(qualifiedName: string): Promise<string> {
    const symbolTable = await this.getSymbolTable();
    for (const [filePath, compilationUnit] of Object.entries(symbolTable)) {
      if (Object.keys(compilationUnit.type_declarations).includes(qualifiedName)) {
        return filePath;
      }
    }
    throw new Error(`Class ${qualifiedName} not found in the application.`);
  }
}
