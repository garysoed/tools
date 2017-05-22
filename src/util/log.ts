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
  private static COLOR_ENABLED_: boolean = true;
  private static ENABLED_: boolean = true;

  private namespace_: string;

  /**
   * @param namespace Namespace of the log messages.
   */
  constructor(namespace: string) {
    this.namespace_ = namespace;
  }

  private callIfEnabled_(fn: (message: string, ...args: string[]) => void, message: string): void {
    if (Log.ENABLED_) {
      const matches = message.replace(/%%/g, 'a').match(/%c/g);
      const colorCount = matches ? matches.length : 0;
      const colors: string[] = [];
      for (let i = 0; i < colorCount; i++) {
        const isDefault = (i % 2) === 0;
        colors.push(isDefault ? 'font-weight: normal;' : 'font-weight: bold;');
      }
      fn(`[${this.namespace_}] ${message}`, ...colors);
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

  static highlight(literals: TemplateStringsArray, ...placeholders: string[]): string {
    let out = Log.COLOR_ENABLED_ ? '%c' : '';
    for (let i = 0; i < placeholders.length; i++) {
      if (Log.COLOR_ENABLED_) {
        out += `${literals[i].replace(/%c/g, '%%c')}%c${placeholders[i].replace(/%c/g, '%%c')}%c`;
      } else {
        out += `${literals[i]}${placeholders[i]}`;
      }
    }
    return out;
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

  static of(namespace: string): Log {
    return new Log(namespace);
  }

  static setColorEnabled(enabled: boolean): void {
    Log.COLOR_ENABLED_ = enabled;
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
