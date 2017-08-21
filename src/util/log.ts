/**
 * Wrapper around `console.log`.
 *
 * This adds namespace to the start of every log. You can also enable / disable logging using the
 * [[setEnabled]] method.
 *
 * Example usage:
 *
 * ```typescript
 * import Log from './log';
 *
 * const LOG = new Log('namespace');
 *
 * Log.error(LOG, 'Error message');
 * ```
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  OFF = 4,
}

export class Log {
  private static COLOR_ENABLED_: boolean = true;
  private static ENABLED_LOG_LEVEL_: LogLevel = LogLevel.INFO;

  private namespace_: string;

  /**
   * @param namespace Namespace of the log messages.
   */
  constructor(namespace: string) {
    this.namespace_ = namespace;
  }

  private callIfEnabled_(
      fn: (message: string, ...args: any[]) => void,
      logLevel: LogLevel,
      color: string,
      ...messages: any[]): void {
    if (logLevel >= Log.ENABLED_LOG_LEVEL_) {
      const usedColor = Log.COLOR_ENABLED_ ? color : 'default';
      fn(
          `%c${this.namespace_}%c`,
          `color: ${usedColor}`,
          `color: default`,
          ...messages);
    }
  }

  static debug(log: Log, ...messages: any[]): void {
    log.callIfEnabled_(
        console.debug.bind(console), LogLevel.DEBUG, '#8000ff', ...messages);
  }

  /**
   * Logs error message
   *
   * @param log The log object.
   * @param message The message to log.
   */
  static error(log: Log, ...messages: any[]): void {
    log.callIfEnabled_(
        console.error.bind(console), LogLevel.ERROR, '#800000', ...messages);
  }

  static getEnabledLevel(): LogLevel {
    return Log.ENABLED_LOG_LEVEL_;
  }

  static groupCollapsed(log: Log, ...messages: any[]): void {
    log.callIfEnabled_(
        console.groupCollapsed.bind(console), LogLevel.INFO, '#808080', ...messages);
  }

  static groupEnd(log: Log): void {
    log.callIfEnabled_(console.groupEnd.bind(console), LogLevel.INFO, '');
  }

  /**
   * Logs info message.
   *
   * @param log The log object.
   * @param message The message to log.
   */
  static info(log: Log, ...messages: any[]): void {
    log.callIfEnabled_(console.info.bind(console), LogLevel.INFO, '#00bfff', ...messages);
  }

  static of(namespace: string): Log {
    return new Log(namespace);
  }

  static setColorEnabled(enabled: boolean): void {
    Log.COLOR_ENABLED_ = enabled;
  }

  /**
   * Sets the enabled logging level..
   */
  static setEnabledLevel(logLevel: LogLevel): void {
    Log.ENABLED_LOG_LEVEL_ = logLevel;
  }

  static trace(log: Log): void {
    log.callIfEnabled_(console.trace.bind(console), LogLevel.DEBUG, '');
  }

  /**
   * Logs warning message.
   *
   * @param log The log object.
   * @param message The message to log.
   */
  static warn(log: Log, ...messages: any[]): void {
    log.callIfEnabled_(console.warn.bind(console), LogLevel.WARNING, '#ff9f00', ...messages);
  }
}
