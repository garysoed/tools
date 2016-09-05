import {AnyAssert} from './any-assert';


/**
 * String related assertions.
 */
export class StringAssert extends AnyAssert {
  /**
   * @param value_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private stringValue_: string,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(stringValue_, reversed, expect);
  }

  /**
   * Asserts that the value matches the given regexp.
   */
  match(regexp: RegExp): void {
    this.getMatchers_().toEqual(jasmine.stringMatching(regexp));
  }
}
