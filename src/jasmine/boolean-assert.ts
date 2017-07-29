import { BaseAssert } from '../jasmine/base-assert';


/**
 * Boolean related assertions.
 */
export class BooleanAssert extends BaseAssert {
  /**
   * @param booleanValue_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      booleanValue: boolean,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(booleanValue, reversed, expect);
  }

  be(value: boolean): void {
    this.getMatchers_().toBe(value);
  }

  /**
   * Asserts that the value is false.
   */
  beFalse(): void {
    this.be(false);
  }

  /**
   * Asserts that the value is true.
   */
  beTrue(): void {
    this.be(true);
  }
}
