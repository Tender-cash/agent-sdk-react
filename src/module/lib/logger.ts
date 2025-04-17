
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
type LogLevel = "info" | "warn" | "error" | "debug";

interface LoggerOptions {
	level: LogLevel;
	message: string;
	meta?: Record<string, any> | any[]; // Any additional info you want to log
}

class Logger {
  static show = false;
  
	static log({ level, message, meta }: LoggerOptions) {
		// Log to the console in development
		this.logToConsole(level, message, meta);
	}

	private static logToConsole(level: LogLevel, message: string, meta?: Record<string, any>) {
		const logMethod = {
			info: console.info,
			warn: console.warn,
			error: console.error,
			debug: console.debug,
		}[level];
    if (this.show){
      logMethod(`[${level.toUpperCase()}]: ${message}`, meta || "");
    }
	}

	// Shortcut methods
	static info(message: string, meta?: Record<string, any>) {
		this.log({ level: "info", message, meta });
	}

	static warn(message: string, meta?: Record<string, any>) {
		this.log({ level: "warn", message, meta });
	}

	static error(message: string, meta?: Record<string, any>) {
		this.log({ level: "error", message, meta });
	}

	static debug(message: string, meta?: Record<string, any>) {
		this.log({ level: "debug", message, meta });
	}

  static showLogger(v: boolean){
    this.show = false;
  }
}

export default Logger;
