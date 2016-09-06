import {AnyAssert} from './any-assert';


export class FunctionAssert extends AnyAssert<Function> {
  /**
   * @param functionValue_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private functionValue_: Function,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(functionValue_, reversed, expect);
  }

  /**
   * Checks that invoking the given function will throw error with message matching the given
   * Regexp.
   *
   * @param regexp Regular expression that the error message should match.
   */
  throwError(regexp: RegExp): void {
    this.getMatchers_().toThrowError(regexp);
  }
}
