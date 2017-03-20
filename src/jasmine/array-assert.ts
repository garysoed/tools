import { AnyAssert } from './any-assert';


export class ArrayAssert<T> extends AnyAssert<T[]> {
  /**
   * @param arrayValue_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private arrayValue_: T[],
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(arrayValue_, reversed, expect);
  }

  /**
   * Checks if the array contains the given element.
   */
  contain(element: T): void {
    this.getMatchers_().toContain(element);
  }
}
