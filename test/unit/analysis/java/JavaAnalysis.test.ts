import { JCallable, JCallableParameter, JType } from "../../../../src/models/java/";
import { daytraderJavaAnalysis } from "../../../conftest";
import { expect, test } from "bun:test";
import { logger } from "../../../../src/utils";

test("Should get analysis object from JavaAnalysis object", () => {
  expect(daytraderJavaAnalysis).toBeDefined();
});

test("Should get JApplication instance", async () => {
  const jApplication = await daytraderJavaAnalysis.getApplication();
  expect(jApplication).toBeDefined();
});

test("Should get Symbol Table", async () => {
  const symbolTable = await daytraderJavaAnalysis.getSymbolTable();
  expect(symbolTable).toBeDefined();
});

test("Should get all classes in a Java application", async () => {
  await expect(daytraderJavaAnalysis.getAllClasses()).toBeDefined();
});

test("Should get a specific class the application", async () => {
  const tradeDirectObject = await daytraderJavaAnalysis.getClassByQualifiedName("com.ibm.websphere.samples.daytrader.impl.direct.TradeDirect");
  expect(async () => JType.parse(tradeDirectObject)).not.toThrow();
});

test("Should throw error when a requested class in the application does not exist", async () => {
  /**
   * Quick note to self: There is a subtle difference between await expect(...) and expect(await ...)
   * When there is an error, the reject happens even before the expect can be honored. So instead, we await the expect
   * by saying "Hey, I expect this promise to be rejected with this error ..." 
   */
  await expect(daytraderJavaAnalysis.getClassByQualifiedName("this.class.does.not.Exist")).rejects.toThrow(
    "Class this.class.does.not.Exist not found in the application.");
});

test("Should get all methods in the application", () => {
  return daytraderJavaAnalysis.getAllMethods().then((methods) => {
    expect(methods).toBeDefined()
  });
});

test("Should get all methods in a specific class in the application", async () => {
  expect(
    (
      await daytraderJavaAnalysis.getAllMethodsByClass("com.ibm.websphere.samples.daytrader.impl.direct.TradeDirect")).length
  ).toBeGreaterThan(0)
});

test("Should get a specific method in a specific class in the application", async () => {
  const method = await daytraderJavaAnalysis.getMethodByQualifiedName(
    "com.ibm.websphere.samples.daytrader.impl.direct.TradeDirect", "publishQuotePriceChange(QuoteDataBean, BigDecimal, BigDecimal, double)");

  expect(async () => JCallable.parse(method)).not.toThrow();
});

test("Should get parameters of a specific method in a specific class in the application", async () => {
  const parameters = await daytraderJavaAnalysis.getMethodParameters(
    "com.ibm.websphere.samples.daytrader.impl.direct.TradeDirect", "publishQuotePriceChange(QuoteDataBean, BigDecimal, BigDecimal, double)");

  expect(parameters).toBeDefined();
  logger.success("parameters are defined");
  expect(parameters.length).toBe(4);
  logger.success("there are 4 parameters");
  parameters.forEach(param => {
    expect(async () => JCallableParameter.parse(param)).not.toThrow();
  });
  logger.success("All parameters are valid JCallableParameter instances");
});

test("Should get parameters of a specific method in a specific class in the application given the callable object", async () => {
  const method = await daytraderJavaAnalysis.getMethodByQualifiedName(
    "com.ibm.websphere.samples.daytrader.impl.direct.TradeDirect", "publishQuotePriceChange(QuoteDataBean, BigDecimal, BigDecimal, double)");
  const parameters = await daytraderJavaAnalysis.getMethodParametersFromCallable(method);
  expect(parameters).toBeDefined();
  logger.success("parameters are defined");
  expect(parameters.length).toBe(4);
  logger.success("there are 4 parameters");
  parameters.forEach(param => {
    expect(async () => JCallableParameter.parse(param)).not.toThrow();
  }
  );
  logger.success("All parameters are valid JCallableParameter instances");
});


test("Should get file path for a specific class in the application", async () => {
  const filePath = await daytraderJavaAnalysis.getJavaFilePathByQualifiedName("com.ibm.websphere.samples.daytrader.impl.direct.TradeDirect");
  expect(filePath).toBeDefined();
  expect(filePath).toContain(
    "main/java/com/ibm/websphere/samples/daytrader/impl/direct/TradeDirect.java");
});