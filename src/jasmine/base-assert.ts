export class BaseAssert {
  protected anyValue_: any;
  protected reversed_: boolean;
  protected expect_: (actual: any) => jasmine.Matchers;

  /**
   * @param value_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      value: any,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    this.anyValue_ = value;
    this.reversed_ = reversed;
    this.expect_ = expect;
  }

  /**
   * @return The base matchers object for checking.
   */
  protected getMatchers_(): jasmine.Matchers {
    return this.reversed_ ? this.expect_(this.anyValue_).not : this.expect_(this.anyValue_);
  }
}
