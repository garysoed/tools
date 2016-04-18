import Asserts from '../assert/asserts';
import Cache from '../data/a-cache';


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
  @Cache()
  static polyfill(): void {
    let KeyboardEvent = window['KeyboardEvent'];
    Asserts.any(KeyboardEvent).to.beDefined().orThrows('KeyboardEvent not defined');

    if (!KeyboardEvent.prototype.key) {
      Object.defineProperty(KeyboardEvent.prototype, 'key', {
        get: function(): string {
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
