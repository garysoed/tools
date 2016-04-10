import AssertResolution from './assert-resolution';


/**
 * Base class of all asserts.
 *
 * @param <V> The type of the value to check.
 */
class BaseAsserts<V> {
  private reversed_: boolean;
  private value_: V;

  /**
   * @param value The value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: V, reversed: boolean) {
    this.reversed_ = reversed;
    this.value_ = value;
  }

  /**
   * Resolves the assertion with the given result.
   *
   * @param result True iff the assertion passes, ignoring reversal rule.
   * @return The resolution object.
   */
  resolve(result: boolean): AssertResolution {
    return new AssertResolution(result, this.reversed_);
  }

  /**
   * Value to check.
   */
  get value(): V {
    return this.value_;
  }
}

export default BaseAsserts;
