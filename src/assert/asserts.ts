import StringAsserts from './string-asserts';


/**
 * Handles assertions during runtime.
 *
 * Unlike [[Checks]], this is type safe and throws error. Use this when you know the type of the
 * value to check and want to throw error.
 */
class Asserts {
  /**
   * Assert string values.
   */
  static string = StringAsserts
}

export default Asserts;
