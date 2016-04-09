import AssertsFactory from './asserts-factory';
import StringAsserts from './string-asserts';


// Asserts.string(...).is{Not}.empty().orThrows(...)
/**
 * Handles assertions during runtime.
 *
 * Unlike [[Checks]], this is type safe and throws error. Use this when you know the type of the
 * value to check and want to throw error. Use this class as a starting point for all assertions.
 *
 * Example usage:
 *
 * ```typescript
 * import Asserts from 'assert/asserts';
 *
 * Asserts.string('not empty').isNot.empty();
 * ```
 */
class Asserts {
  /**
   * Starts string related assertions
   *
   * @param value The value to check.
   * @return Factory object to continue the assertion chain.
   */
  static string(value: string): AssertsFactory<StringAsserts> {
    return new AssertsFactory<StringAsserts>(StringAsserts.bind(null, value));
  }
}

export default Asserts;
