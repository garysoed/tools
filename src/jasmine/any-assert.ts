/**
 * Assertion for any values..
 */
export class AnyAssert {
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

  /**
   * Checks that the value is an instance of the given class.
   */
  beAnInstanceOf(clazz: Object): void {
    this.getMatchers_().toEqual(jasmine.any(clazz));
  }

  /**
   * Checks that the value is defined.
   */
  beDefined(): void {
    this.getMatchers_().toBeDefined();
  }

  /**
   * Checks that the value is falsy.
   */
  beFalsy(): void {
    this.getMatchers_().toBeFalsy();
  }

  /**
   * Checks that the value is null.
   */
  beNull(): void {
    this.getMatchers_().toBeNull();
  }

  /**
   * Checks that the value is truthy.
   */
  beTruthy(): void {
    this.getMatchers_().toBeTruthy();
  }
}
