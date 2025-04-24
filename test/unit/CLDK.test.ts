import { CLDK } from "../../src";
import { JavaAnalysis } from "../../src/analysis/java";
import { test, expect, mock } from "bun:test";

// Let's first create a mock object for the JavaAnalysis class.
mock.module(
    "../../src/analysis/java", () => ({
        JavaAnalysis: class MockJavaAnalysis {
            params: any;
            constructor(params: any) {
                this.params = params;
            }
        }
    })
);

test("CLDK initialization with Java language", () => {
    const cldk = new CLDK("java");
    expect(cldk.language).toBe("java");
});

test("CLDK must throw and error when the language is not Java", () => {
    const cldk = new CLDK("python");
    expect(() => cldk.analysis({
        projectPath: "fake/path",
        sourceCode: null,
        analysisLevel: "Symbol Table",
    })).toThrowError("Analysis support for python is not implemented yet.");
});

test("CLDK analysis method with projectPath", () => {
    const cldk = new CLDK("java");
    const analysis = cldk.analysis({
        projectPath: "fake/path",
        sourceCode: null,
        analysisLevel: "Symbol Table",
    });
    expect(analysis.params.projectDir).toBe("fake/path");
    expect(analysis.params.sourceCode).toBe(null);
    expect(analysis.params.analysisLevel).toBe("Symbol Table");
});

test("CLDK analysis method with sourceCode", () => {
    const cldk = new CLDK("java");
    const analysis = cldk.analysis({
        projectPath: null,
        sourceCode: "import { someFunction } from 'some-module';",
        analysisLevel: "Symbol Table",
    });
    expect(analysis.params.projectDir).toBe(null);
    expect(analysis.params.sourceCode).toBe("import { someFunction } from 'some-module';");
    expect(analysis.params.analysisLevel).toBe("Symbol Table");
});

test ("CLDK analysis method must throw an error when both projectPath and sourceCode are provided", () => {
    const cldk = new CLDK("java");
    expect(() => cldk.analysis({
        projectPath: "fake/path",
        sourceCode: "import { someFunction } from 'some-module';",
        analysisLevel: "Symbol Table",
    })).toThrowError("Both projectPath and sourceCode are provided. Please provide only one.");
});

test("CLDK analysis method must throw an error when neither projectPath nor sourceCode is provided", () => {
    const cldk = new CLDK("java");
    expect(() => cldk.analysis({
        projectPath: null,
        sourceCode: null,
        analysisLevel: "Symbol Table",
    })).toThrowError("Either projectPath or sourceCode must be provided.");
});