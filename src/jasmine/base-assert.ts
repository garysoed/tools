export class BaseAssert {
  /**
   * @param value_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private readonly anyValue_: any,
      private readonly reversed_: boolean,
      private readonly expect_: (actual: any) => jasmine.Matchers<any>) {
  }

  /**
   * @return The base matchers object for checking.
   */
  getMatchers_(value: any = this.anyValue_): jasmine.Matchers<any> {
    return this.reversed_ ? this.expect_(value).not : this.expect_(value);
  }
}
// TODO: Mutable
