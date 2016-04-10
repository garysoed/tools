import AssertResolution from './assert-resolution';
import BaseAsserts from './base-asserts';


/**
 * Assertions for any maps.
 */
class MapAsserts extends BaseAsserts<Map<any, any>> {

  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: Map<any, any>, reversed: boolean) {
    super(value, reversed);
  }

  /**
   * Asserts that the map contains the given key.
   *
   * @param key The key to check.
   * @return The resolution object.
   */
  containKey(key: any): AssertResolution {
    return this.resolve(this.value.has(key));
  }
}

export default MapAsserts;
