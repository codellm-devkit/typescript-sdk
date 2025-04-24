import {JavaAnalysis} from "./analysis/java";

export class CLDK {
    /**
     * The programming language of choice
     */
    private language: string;

    constructor(language: string) {
        this.language = language;
    }

    public analysis({
                        projectPath,
                        sourceCode,
                        analysisLevel = "Symbol Table",
                    }: {
        projectPath?: string | null;
        sourceCode?: string | null;
        analysisLevel?: string;
    }): JavaAnalysis {
        if (projectPath === null && sourceCode === null) {
            throw new Error("Either projectPath or sourceCode must be provided.");
        }

        if (projectPath !== null && sourceCode !== null) {
            throw new Error("Both projectPath and sourceCode are provided. Please provide only one.");
        }

        if (this.language === "java") {
            return new JavaAnalysis({
                projectDir: projectPath,
                sourceCode: sourceCode,
                analysisLevel: analysisLevel,
            });
        } else {
            throw new Error(`Analysis support for ${this.language} is not implemented yet.`);
        }
    }
}
