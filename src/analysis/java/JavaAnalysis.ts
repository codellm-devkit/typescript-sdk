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
import log from "loglevel";
import {spawn, spawnSync} from "node:child_process";
import {JApplication} from "../../models/java";
import {JApplicationType, JCompilationUnitType} from "../../models/java/types";
import os from "os";
import JSONStream from "JSONStream";

enum AnalysisLevel {
    SYMBOL_TABLE = "1",
    CALL_GRAPH = "2",
    SYSTEM_DEPENDENCY_GRAPH = "3",
}

const analysisLevelMap: Record<string, AnalysisLevel> = {
    "symbol table": AnalysisLevel.SYMBOL_TABLE,
    "call graph": AnalysisLevel.CALL_GRAPH,
    "system dependency graph": AnalysisLevel.SYSTEM_DEPENDENCY_GRAPH
};

export class JavaAnalysis {
    private readonly projectDir: string | null;
    private readonly analysisLevel: AnalysisLevel;
    application?: JApplicationType;

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
            console.log("Default codeanalyzer jar not found.");
            throw new Error("Default codeanalyzer jar not found.");
        }
        log.info("Codeanalyzer jar found at:", jarPath);
        return ["java", "-jar", jarPath];
    }

    /**
     * Initialize the application by running the codeanalyzer and parsing the output.
     * @private
     * @returns {Promise<JApplicationType>} A promise that resolves to the parsed application data
     * @throws {Error} If the project directory is not specified or if codeanalyzer fails
     */
    private async _initialize_application(): Promise<JApplicationType> {
        return new Promise<JApplicationType>((resolve, reject) => {
            if (!this.projectDir) {
                return reject(new Error("Project directory not specified"));
            }

            const projectPath = path.resolve(this.projectDir);
            /**
             * I kept running into OOM issues when running the codeanalyzer output is piped to stream.
             * So I decided to write the output to a temporary file and then read the file.
             */
                // Create a temporary file to store the codeanalyzer output
            const crypto = require('crypto');
            const tmpFilePath = path.join(os.tmpdir(), `${Date.now()}-${crypto.randomUUID()}`);
            const command = [...this.getCodeAnalyzerExec(), "-i", projectPath, '-o', tmpFilePath, `--analysis-level=${this.analysisLevel}`, '--verbose'];
            log.debug(command.join(" "));

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
                const stream = fs.createReadStream(path.join(tmpFilePath, 'analysis.json')).pipe(JSONStream.parse());
                const result = {} as JApplicationType;

                stream.on('data', (data) => {
                    Object.assign(result, JApplication.parse(data));
                });

                stream.on('end', () => {
                    // Clean up the temporary file
                    fs.rm(tmpFilePath, {recursive: true, force: true}, (err) => {
                        if (err) log.warn(`Failed to delete temporary file: ${tmpFilePath}`, err);
                    });
                    resolve(result as JApplicationType);
                });

                stream.on('error', (err) => {
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
     * @returns {Promise<JApplicationType>} A promise that resolves to the application data
     */
    public async getApplication(): Promise<JApplicationType> {
        if (!this.application) {
            this.application = await this._initialize_application();
        }
        return this.application;
    }

    public async getSymbolTable(): Promise<Record<string, JCompilationUnitType>> {
        return (await this.getApplication()).symbol_table;
    }
}

