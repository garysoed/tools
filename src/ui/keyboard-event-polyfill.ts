import Cache from '../data/a-cache';
import { Validate } from '../valid/validate';


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
    Validate.any(KeyboardEvent)
        .to.beDefined()
        .orThrows('KeyboardEvent not defined')
        .assertValid();

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
