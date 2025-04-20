class CodeanalyzerExecutionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CodeanalyzerExecutionException';
    Object.setPrototypeOf(this, CodeanalyzerExecutionException.prototype); // Recommended for ES5 and earlier
  }
}