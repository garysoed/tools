import { IterableAssert } from '../jasmine/iterable-assert';


export class ArrayAssert<T> extends IterableAssert<T> {
  /**
   * @param arrayValue_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      arrayValue: T[],
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers<T[]>) {
    super(arrayValue, reversed, expect);
  }

  /**
   * Checks if the array contains the given element.
   */
  contain(element: T): void {
    this.getMatchers_().toContain(element);
  }
}
