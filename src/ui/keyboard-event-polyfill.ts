import { cache } from '../data/cache';


/**
 * Polyfills KeyboardEvent.
 *
 * Included polyfill:
 *
 * -   `key` property.
 */
class KeyboardEventPolyfill {
  /**
   * Installs polyfill to the window.
   */
  @cache()
  static polyfill(): void {
    const KeyboardEvent = window['KeyboardEvent'];
    if (!KeyboardEvent) {
      throw new Error('KeyboardEvent not defined');
    }

    if (!KeyboardEvent.prototype.key) {
      Object.defineProperty(KeyboardEvent.prototype, 'key', {
        get: function(this: KeyboardEvent): string {
          if (this.charCode !== undefined) {
            return String.fromCharCode(this.charCode);
          }
          throw Error(`Unhandled KeyboardEvent platform`);
        },
      });
    }
  }
}

export default KeyboardEventPolyfill;
// TODO: Mutable
