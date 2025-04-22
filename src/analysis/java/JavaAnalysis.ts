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
import log from "loglevel";
import {spawnSync} from "node:child_process";
import {JavaAnalysisOptions} from "./interfaces";
import {JApplication} from "../../models/java";
import {JApplicationType} from "../../models/java/types";

enum AnalysisLevel {
    SYMBOL_TABLE = 1,
    CALL_GRAPH = 2,
    PROGRAM_DEPENDENCY_GRAPH = 3,
    SYSTEM_DEPENDENCY_GRAPH = 4
}

const analysisLevelMap: Record<string, AnalysisLevel> = {
  "symbol table": AnalysisLevel.SYMBOL_TABLE,
  "call graph": AnalysisLevel.CALL_GRAPH,
  "program dependency graph": AnalysisLevel.PROGRAM_DEPENDENCY_GRAPH,
  "system dependency graph": AnalysisLevel.SYSTEM_DEPENDENCY_GRAPH
};

export class JavaAnalysis {
    private readonly projectDir: string | null;
    private sourceCode?: string | null;
    private readonly analysisLevel: AnalysisLevel;
    application?: JApplicationType;

    constructor(options: { projectDir: string |null; sourceCode: string | null; analysisLevel: string }) {
        this.projectDir = options.projectDir;
        this.sourceCode = options.sourceCode;
        this.analysisLevel = analysisLevelMap[options.analysisLevel] ?? AnalysisLevel.SYMBOL_TABLE;
        this.application = this.init();
    }

    private getCodeAnalyzerExec(): string[] {
        const codeanalyzerJarPath = path.resolve(__dirname, "../../../cldk/analysis/java/codeanalyzer/jar/");
        const pattern = path.join(codeanalyzerJarPath, "**/codeanalyzer-*.jar").replace(/\\/g, "/");
        const matches = fg.sync(pattern);
        const jarPath = matches[0];

        if (!jarPath) {
            log.error("Default codeanalyzer jar not found.");
            throw new Error("Default codeanalyzer jar not found.");
        }
        log.info("Codeanalyzer jar found at:", jarPath);
        return ["java", "-jar", jarPath];
    }

    private init() {
        if (this.projectDir != null) {
            const projectPath = path.resolve(this.projectDir);
            const extraArgs = ["-i", projectPath, `--analysis-level=${this.analysisLevel}`];
        }
        const extraArgs = ["-s", this.sourceCode || "", `--analysis-level=${this.analysisLevel}`];
        const command = [...this.getCodeAnalyzerExec(), ...extraArgs];
        log.info("Running command:", command.join(" "));
        try {
            const result = spawnSync(command[0], command.slice(1), {
                encoding: "utf-8",
                stdio: "pipe"
            });

            if (result.error) {
                throw result.error;
            }

            if (result.status !== 0) {
                throw new CodeanalyzerExecutionException(result.stderr || "Codeanalyzer failed.");
            }

            return JApplication.parse(result.stdout);
        } catch (e: any) {
            throw new CodeanalyzerExecutionException(e.message || String(e));
        }

    }
}