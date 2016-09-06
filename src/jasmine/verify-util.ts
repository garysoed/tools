import {Arrays} from '../collection/arrays';


/**
 * Utility to verify calls.
 */
export class VerifyUtil {
  /**
   * Creates a function to check the expectation.
   *
   * @param baseFunction The base function to create the expectation for.
   * @param reversed True iff the expectation logic should be reversed.
   * @param expect Reference to jasmine's expect function.
   * @return Function that verifies the call to the given base function.'
   */
  private static createCheckFunction_(
      baseFunction: Function,
      reversed: boolean,
      expect: (...args: any[]) => jasmine.Matchers): Function {
    return (...args: any[]) => {
      let matchers = reversed ? expect(baseFunction).not : expect(baseFunction);
      matchers.toHaveBeenCalledWith.apply(matchers, args);
    };
  }

  /**
   * Creates a verification object / function.
   *
   * @param instance The instance to verify.
   * @param reversed True iff the verification logic should be reversed.
   * @return If the given instance is an object, this is an object that verifies all methods in the
   *    given object. If the given instance is a function, this is a function that verifies calls
   *    to the given function.
   */
  static create(instance: any, reversed: boolean): any {
    if (instance instanceof Function) {
      return VerifyUtil.createCheckFunction_(instance, reversed, expect);
    } else {
      let continuation = {};
      Arrays
          .of(Object.getOwnPropertyNames(instance))
          .forEach((name: string) => {
            continuation[name] = VerifyUtil.createCheckFunction_(instance[name], reversed, expect);
          });
      return continuation;
    }
  }
}
