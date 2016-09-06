import {AnyAssert} from './any-assert';


/**
 * Boolean related assertions.
 */
export class BooleanAssert extends AnyAssert<boolean> {
  /**
   * @param booleanValue_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private booleanValue_: boolean,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(booleanValue_, reversed, expect);
  }

  /**
   * Asserts that the value is false.
   */
  beFalse(): void {
    this.getMatchers_().toBe(false);
  }

  /**
   * Asserts that the value is true.
   */
  beTrue(): void {
    this.getMatchers_().toBe(true);
  }
}
