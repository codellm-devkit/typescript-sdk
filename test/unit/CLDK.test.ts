import { CLDK } from "../../src";
import { test, expect } from "bun:test";

/**
 * These first set of tests are to test the CLDK class
 */
test("CLDK initialization with Java language", () => {
    expect(CLDK.for("java").getLanguage()).toBe("java");
});

test("CLDK must throw and error when the language is not Java", () => {
    expect(() => CLDK.for("python").analysis({
        projectPath: "fake/path",
        analysisLevel: "Symbol Table",
    })).toThrowError("Analysis support for python is not implemented yet.");
});


test("CLDK Analysis level must be set to 1 for symbol table", () => {
    const analysis = CLDK.for("java").analysis({
        projectPath: "fake/path",
        analysisLevel: "Symbol Table",
    });
    expect(analysis.analysisLevel).toBe("1");
});

test("CLDK Analysis level must be set to 2 for call graph", () => {
    const analysis = CLDK.for("java").analysis({
        projectPath: "fake/path",
        analysisLevel: "Call Graph",
    });
    expect(analysis.analysisLevel).toBe("2");
});

test("CLDK Analysis level must be set to 3 for system dependency graph", () => {
    const analysis = CLDK.for("java").analysis({
        projectPath: "fake/path",
        analysisLevel: "system dependency graph",
    });
    expect(analysis.analysisLevel).toBe("3");
});

/**
 * Okay, so now we can test if we can call codeanalyzer with the right arguments
 */
test("CLDK must get the correct codeanalyzer execution command", () => {
   const analysis = CLDK.for("java").analysis({
        projectPath: "fake/path",
        analysisLevel: "Symbol Table",
    });

    const codeAnalyzerExec = analysis.getCodeAnalyzerExec();
    expect(codeAnalyzerExec[0]).toBe("java");
    expect(codeAnalyzerExec[1]).toBe("-jar");
    expect(codeAnalyzerExec[2]).toMatch(/codeanalyzer-.*\.jar/);
});