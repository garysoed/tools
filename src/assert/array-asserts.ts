import AssertResolution from './assert-resolution';
import BaseAsserts from './base-asserts';


/**
 * Assertions for any arrays.
 */
class ArrayAsserts extends BaseAsserts<any[]> {

  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: any[], reversed: boolean) {
    super(value, reversed);
  }

  /**
   * Asserts that the array is empty.
   *
   * @return The resolution object.
   */
  beEmpty(): AssertResolution {
    return this.resolve(this.value.length === 0);
  }

  /**
   * Asserts that the array contains the given element.
   *
   * @param element The element to check.
   * @return The resolution object.
   */
  contain(element: any): AssertResolution {
    return this.resolve(this.value.indexOf(element) >= 0);
  }
}

export default ArrayAsserts;
