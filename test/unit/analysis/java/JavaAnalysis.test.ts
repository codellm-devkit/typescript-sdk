import {daytraderJavaAnalysis} from "../../../conftest";
import {expect, test } from "bun:test";

test("Must get analysis object from JavaAnalysis object", () => {
    expect(daytraderJavaAnalysis).toBeDefined();
});

test("Must get JApplication instance", async () => {
    const jApplication = await daytraderJavaAnalysis.getApplication();
    expect(jApplication).toBeDefined();
});

test("Must get Symbol Table", async () => {
    const symbolTable = await daytraderJavaAnalysis.getSymbolTable();
    expect(symbolTable).toBeDefined();
});