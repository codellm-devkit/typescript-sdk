import path from "path";
import fg from "fast-glob";
import log from "loglevel";
import {spawnSync} from "node:child_process";
import {JavaAnalysisOptions} from "./interfaces";
import {JApplication} from "../../models/java";

enum AnalysisLevel {
    SYMBOL_TABLE = 1,
    CALL_GRAPH = 2,
    PROGRAM_DEPENDENCY_GRAPH = 3,
    SYSTEM_DEPENDENCY_GRAPH = 4
}

const analysisLevelMap = {
  "symbol table": AnalysisLevel.SYMBOL_TABLE,
  "call graph": AnalysisLevel.CALL_GRAPH,
  "program dependency graph": AnalysisLevel.PROGRAM_DEPENDENCY_GRAPH,
  "system dependency graph": AnalysisLevel.SYSTEM_DEPENDENCY_GRAPH
};

export class JavaAnalysis {
    private readonly projectDir: string | null;
    private sourceCode?: string | null;
    private readonly analysisLevel: AnalysisLevel;
    application?: JApplication;

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

            return JApplication.parse(result.stdout);
        } catch (e: any) {
            throw new CodeanalyzerExecutionException(e.message || String(e));
        }

    }
}