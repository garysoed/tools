import AnyAsserts from './any-asserts';
import ArrayAsserts from './array-asserts';
import AssertsFactory from './asserts-factory';
import MapAsserts from './map-asserts';
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

  static any(value: any): AssertsFactory<AnyAsserts> {
    return new AssertsFactory<AnyAsserts>(AnyAsserts.bind(null, value));
  }

  static array(value: any[]): AssertsFactory<ArrayAsserts> {
    return new AssertsFactory<ArrayAsserts>(ArrayAsserts.bind(null, value));
  }

  static map(value: Map<any, any>): AssertsFactory<MapAsserts> {
    return new AssertsFactory<MapAsserts>(MapAsserts.bind(null, value));
  }

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
