import path from "path";
import fg from "fast-glob";
import log from "loglevel";
import { spawnSync } from "node:child_process";
import { JavaAnalysisOptions } from "./interfaces";
import {JApplication} from "../../models/java/types";

export class JavaAnalysis {
    private projectDir: string;
    private sourceCode?: string;
    private analysisLevel: number;
    application?: JApplication;
    constructor(options: JavaAnalysisOptions) {
        this.projectDir = options.projectDir;
        this.sourceCode = options.sourceCode;
        this.analysisLevel = options.analysisLevel === undefined ? 1 : options.analysisLevel;
        // this.application = this.init();
    }

    private getCodeAnalyzerExec(): string[] {
        const fallbackPath = path.resolve(__dirname, "../../../cldk/analysis/java/codeanalyzer/jar/");
        const pattern = path.join(fallbackPath, "**/codeanalyzer-*.jar").replace(/\\/g, "/");
        const matches = fg.sync(pattern);
        const jarPath = matches[0];

        if (!jarPath) {
          throw new Error("Default codeanalyzer jar not found.");
        }
        return ["java", "-jar", jarPath];
    }

    private init() {
        const projectPath = path.resolve(this.projectDir);
        const extraArgs = ["-i", projectPath, `--analysis-level=${this.analysisLevel}`];
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

            return result.stdout;
          } catch (e: any) {
            throw new CodeanalyzerExecutionException(e.message || String(e));
          }

    }
}