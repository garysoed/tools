export class BaseAssert {
  /**
   * @param value_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private value_: any,
      private reversed_: boolean,
      private expect_: (actual: any) => jasmine.Matchers) { }

  /**
   * @return The base matchers object for checking.
   */
  protected getMatchers_(): jasmine.Matchers {
    return this.reversed_ ? this.expect_(this.value_).not : this.expect_(this.value_);
  }
}
