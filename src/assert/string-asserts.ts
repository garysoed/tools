import AssertResolution from './assert-resolution';
import BaseAsserts from './base-asserts';


/**
 * String related assertions.
 */
class StringAsserts extends BaseAsserts<string> {
  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: string, reversed: boolean) {
    super(value, reversed);
  }

  /**
   * Checks that the string is empty.
   *
   * @return The resolution object.
   */
  beEmpty(): AssertResolution {
    return this.resolve(this.value.length === 0);
  }
}

export default StringAsserts;
