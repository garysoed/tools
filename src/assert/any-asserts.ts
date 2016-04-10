import AssertResolution from './assert-resolution';
import BaseAsserts from './base-asserts';


/**
 * Assertions for any values.
 */
class AnyAsserts extends BaseAsserts<any> {
  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: any, reversed: boolean) {
    super(value, reversed);
  }

  /**
   * Checks that the value is not undefined.
   *
   * @return The resolution object.
   */
  beDefined(): AssertResolution {
    return this.resolve(this.value !== undefined);
  }

  /**
   * Checks that the value is equal to the given value.
   *
   * @param other The other value to compare against.
   * @return The resolution object.
   */
  beEqual(other: any): AssertResolution {
    return this.resolve(this.value === other);
  }
}

export default AnyAsserts;
