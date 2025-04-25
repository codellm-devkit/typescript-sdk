import {JavaAnalysis} from "./analysis/java";
import {spawnSync} from "node:child_process";

export class CLDK {
    /**
     * The programming language of choice
     */
    private language: string;

    constructor(language: string) {
        this.language = language;
    }

    /**
     * A static for method to create a new instance of the CLDK class
     */
    public static for(language: string): CLDK {
        return new CLDK(language);
    }

    /**
     * Implementation of the analysis method
     */
    Implementation
    public analysis({ projectPath, analysisLevel}): JavaAnalysis {
        if (this.language === "java") {
            this.makeSureJavaIsInstalled();
            return new JavaAnalysis({
                projectDir: projectPath,
                analysisLevel: analysisLevel,
            });
        } else {
            throw new Error(`Analysis support for ${this.language} is not implemented yet.`);
        }
    }

    private makeSureJavaIsInstalled(): Promise<void> {
        try {
            const result = spawnSync("java", ["-version"], {encoding: "utf-8", stdio: "pipe"});
            if (result.error) {
                throw result.error;
            }
            if (result.status !== 0) {
                throw new Error(result.stderr || "Java is not installed.");
            }
        } catch (e: any) {
            throw new Error(e.message || String(e));
        }
        return Promise.resolve();
    }
}
