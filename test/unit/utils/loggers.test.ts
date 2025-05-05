import { test, expect } from 'bun:test';
import { logger, createLogger } from '../../../src/utils/logger';

test("Should create a logger instance", () => {
    expect(logger).toBeDefined();
});

test("Should log info message without throwing", () => {
    expect(() => logger.info("This is an info message")).not.toThrow();
});

test("Should log success message without throwing", () => {
    expect(() => logger.success("This is a success message")).not.toThrow();
});

test("Should log warning message without throwing", () => {
    expect(() => logger.warn("This is a warning message")).not.toThrow();
});

test("Should log error message without throwing", () => {
    expect(() => logger.error("This is an error message")).not.toThrow();
});

test("Should log debug message without throwing", () => {
    expect(() => logger.debug("This is a debug message")).not.toThrow();
});

test("Should pretty print JSON without throwing", () => {
    expect(() => logger.prettyJson("Test Object", { foo: "bar", baz: 42 })).not.toThrow();
});

test("Should create scoped logger instance", () => {
    const scopedLogger = createLogger("TestScope");
    expect(scopedLogger).toBeDefined();
});

test("Scoped logger must log info without throwing", () => {
    const scopedLogger = createLogger("TestScope");
    expect(() => scopedLogger.info("Scoped info message")).not.toThrow();
});
