class CodeanalyzerExecutionException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CodeanalyzerExecutionException';
        Object.setPrototypeOf(this, CodeanalyzerExecutionException.prototype);
    }
}

class CLDKInitializationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CLDKInitializationException';
        Object.setPrototypeOf(this, CLDKInitializationException.prototype);
    }
}