import AssertResolution from './assert-resolution';
import BaseAsserts from './base-asserts';


/**
 * Assertions for any sets.
 */
export class SetAsserts extends BaseAsserts<Set<any>> {

  /**
   * @param value The set to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: Set<any>, reversed: boolean) {
    super(value, reversed);
  }

  /**
   * Asserts that the set is empty.
   *
   * @return The resolution object.
   */
  beEmpty(): AssertResolution {
    return this.resolve(this.value.size === 0);
  }

  /**
   * Asserts that the set contains the given element.
   *
   * @param element The element to check.
   * @return The resolution object.
   */
  contain(element: any): AssertResolution {
    return this.resolve(this.value.has(element));
  }
}
