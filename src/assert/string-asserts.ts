import AssertResolution from './assert-resolution';


/**
 * String related assertions.
 */
class StringAsserts {
  private reversed_: boolean;
  private value_: string;

  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: string, reversed: boolean = false) {
    this.value_ = value;
    this.reversed_ = reversed;
  }

  /**
   * Checks that the string is empty.
   *
   * @return The resolution object.
   */
  empty(): AssertResolution {
    return new AssertResolution(this.reversed_ === this.value_.length > 0);
  }
}

export default StringAsserts;
