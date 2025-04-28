// logger.ts
import Signale from 'signale';
import chalk from 'chalk';

class Logger {
    /**
     * Instance of Signale for logging messages.
     */

    /** 
     * @note Instead of using `private signale: Signale;`, I am using `InstanceType<typeof Signale>` to tell
     * typescript, "Hey, signale is an instance of the {@link Signale} class."
     */
    private signale: InstanceType<typeof Signale>;

    constructor(scope?: string) {
        this.signale = new Signale({ scope });
    }

    info(...messages: unknown[]) {
        this.signale.info(...messages.map(m => typeof m === 'string' ? chalk.cyan(m) : m));
    }

    success(...messages: unknown[]) {
        this.signale.success(...messages.map(m => typeof m === 'string' ? chalk.greenBright(m) : m));
    }

    warn(...messages: unknown[]) {
        this.signale.warn(...messages.map(m => typeof m === 'string' ? chalk.yellowBright(m) : m));
    }

    error(...messages: unknown[]) {
        this.signale.error(...messages.map(m => typeof m === 'string' ? chalk.redBright.bold(m) : m));
    }

    debug(...messages: unknown[]) {
        this.signale.debug(...messages.map(m => typeof m === 'string' ? chalk.magentaBright(m) : m));
    }

    prettyJson(title: string, obj: any) {
        this.signale.info(chalk.blue.bold(title));
        this.signale.info(chalk.gray(JSON.stringify(obj, null, 2)));
    }
}

export const logger = new Logger();
export function createLogger(scope: string) {
    return new Logger(scope);
}
