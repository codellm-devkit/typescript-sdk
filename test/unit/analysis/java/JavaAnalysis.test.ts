import { JType } from "../../../../src/models/java/";
import { daytraderJavaAnalysis } from "../../../conftest";
import { expect, test } from "bun:test";

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

test("Must get all classes in a Java application", async () => {
  await expect(daytraderJavaAnalysis.getAllClasses()).toBeDefined();
});

test("Must get a specific class the application", async () => {
  const tradeDirectObject = await daytraderJavaAnalysis.getClassByQualifiedName("com.ibm.websphere.samples.daytrader.impl.direct.TradeDirect");
  expect(async () => JType.parse(tradeDirectObject)).not.toThrow(); 
});

test("Must throw error when a requested class in the application does not exist", async () => {
  /**
   * Quick note to self: There is a subtle difference between await expect(...) and expect(await ...)
   * When there is an error, the reject happens even before the expect can be honored. So instead, we await the expect
   * by saying "Hey, I expect this promise to be rejected with this error ..." 
   */
  await expect(daytraderJavaAnalysis.getClassByQualifiedName("this.class.does.not.Exist")).rejects.toThrow(
    "Class this.class.does.not.Exist not found in the application."); 
});

test("Must get all methods in the application", () => {
  return daytraderJavaAnalysis.getAllMethods().then((methods) => {
    expect(methods).toBeDefined()
  });
});

