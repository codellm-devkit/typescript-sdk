import { CLDK } from "../../../../src/";
import {dayTraderApp} from "../../../conftest";
import {expect, test } from "bun:test";

test("Must get analysis object from JavaAnalysis object", () => {
    const analysis = CLDK.for("java").analysis({
        projectPath: dayTraderApp,
        analysisLevel: "Symbol Table",
    });
    expect(analysis).toBeDefined();
});

test("Must get JApplication instance", async () => {
    const analysis = CLDK.for("java").analysis({
        projectPath: dayTraderApp,
        analysisLevel: "Symbol Table",
    });
    const jApplication = await analysis.getApplication();
    expect(jApplication).toBeDefined();
});

test("Must get Symbol Table", async () => {
    const analysis = CLDK.for("java").analysis({
        projectPath: dayTraderApp,
        analysisLevel: "Symbol Table",
    });
    const symbolTable = await analysis.getSymbolTable();
    expect(symbolTable).toBeDefined();
});