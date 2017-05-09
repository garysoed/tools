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
export class Log {
  private static ENABLED_: boolean = true;

  private namespace_: string;

  /**
   * @param namespace Namespace of the log messages.
   */
  constructor(namespace: string) {
    this.namespace_ = namespace;
  }

  private callIfEnabled_(fn: (message: string) => void, message: string): void {
    if (Log.ENABLED_) {
      fn(`[${this.namespace_}] ${message}`);
    }
  }

  /**
   * Logs error message
   *
   * @param log The log object.
   * @param message The message to log.
   */
  static error(log: Log, message: string): void {
    log.callIfEnabled_(console.error.bind(console), message);
  }

  /**
   * Logs info message.
   *
   * @param log The log object.
   * @param message The message to log.
   */
  static info(log: Log, message: string): void {
    log.callIfEnabled_(console.info.bind(console), message);
  }

  /**
   * Enables / disables logging.
   *
   * @param enabled True iff logging should be enabled.
   */
  static setEnabled(enabled: boolean): void {
    Log.ENABLED_ = enabled;
  }

  /**
   * Logs warning message.
   *
   * @param log The log object.
   * @param message The message to log.
   */
  static warn(log: Log, message: string): void {
    log.callIfEnabled_(console.warn.bind(console), message);
  }
}
// TODO: Mutable
