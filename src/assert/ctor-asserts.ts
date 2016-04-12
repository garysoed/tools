import AssertResolution from './assert-resolution';
import BaseAsserts from './base-asserts';


/**
 * Constructor related assertions.
 */
class CtorAsserts extends BaseAsserts<gs.ICtor<any>> {

  /**
   * @param value The constructor to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: gs.ICtor<any>, reversed: boolean) {
    super(value, reversed);
  }

  /**
   * Asserts that the constructor is a descendant or is the same as the given constructor.
   *
   * @param ctor The ancestor constructor to check.
   * @return The assert resolution object.
   */
  extend(ctor: gs.ICtor<any>): AssertResolution {
    return this.resolve(this.value === ctor || this.value.prototype instanceof ctor);
  }
}

export default CtorAsserts;
