import { CLDK } from "../../../../src/";
import {dayTraderApp} from "../../../conftest";

test("Must get analysis object from JavaAnalysis object", () => {
    const cldk = new CLDK("java");
    const analysis = cldk.analysis({
        projectPath: dayTraderApp,
        sourceCode: null,
        analysisLevel: "Symbol Table",
    });
});