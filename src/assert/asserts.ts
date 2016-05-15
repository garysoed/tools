import AnyAsserts from './any-asserts';
import ArrayAsserts from './array-asserts';
import AssertsFactory from './asserts-factory';
import CtorAsserts from './ctor-asserts';
import MapAsserts from './map-asserts';
import {SetAsserts} from './set-asserts';
import StringAsserts from './string-asserts';


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
 * Asserts.string('not empty').to.beEmpty();
 * ```
 */
class Asserts {

  /**
   * Starts a general value related assertions.
   *
   * @param value The value to check.
   * @return Factory object to continue the assertion chain.
   */
  static any(value: any): AssertsFactory<AnyAsserts> {
    return new AssertsFactory<AnyAsserts>(AnyAsserts.bind(null, value));
  }

  /**
   * Starts array related assertions.
   *
   * @param value The array to check.
   * @return Factory object to continue the assertion chain.
   */
  static array(value: any[]): AssertsFactory<ArrayAsserts> {
    return new AssertsFactory<ArrayAsserts>(ArrayAsserts.bind(null, value));
  }

  /**
   * Starts a constructor related assertions.
   *
   * @param value The constructor to check.
   * @return Factory object to continue the assertion chain.
   */
  static ctor(value: any): AssertsFactory<CtorAsserts> {
    return new AssertsFactory<CtorAsserts>(CtorAsserts.bind(null, value));
  }

  /**
   * Starts map related assertions.
   *
   * @param value The map to check.
   * @return Factory object to continue the assertion chain.
   */
  static map(value: Map<any, any>): AssertsFactory<MapAsserts> {
    return new AssertsFactory<MapAsserts>(MapAsserts.bind(null, value));
  }

  /**
   * Starts set related assertions.
   *
   * @param value The set to check.
   * @return Factory object to continue the assertion chain.
   */
  static set(value: Set<any>): AssertsFactory<SetAsserts> {
    return new AssertsFactory<SetAsserts>(SetAsserts.bind(null, value));
  }

  /**
   * Starts string related assertions
   *
   * @param value The string to check.
   * @return Factory object to continue the assertion chain.
   */
  static string(value: string): AssertsFactory<StringAsserts> {
    return new AssertsFactory<StringAsserts>(StringAsserts.bind(null, value));
  }
}

export default Asserts;
