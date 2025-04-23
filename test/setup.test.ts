import {test} from "bun:test";
import path from "path";
import fs from "fs";
import {dayTraderApp} from "./conftest";

test("test setup", () => {
    if (!dayTraderApp) {
        console.error("Daytrader application directory not found");
        throw new Error("Daytrader application not set up correctly.");
    }
    console.log("Daytrader application directory:", dayTraderApp);
    const zipFilePath = path.join(__dirname, "test-applications", "java", "daytrader8-1.2.zip");
    if (!fs.existsSync(zipFilePath)) {
        throw new Error("Daytrader application zip file not found.");
    }
    console.log("Daytrader application zip file:", zipFilePath);
});