import { Sets } from '../collection/sets';

import { AnyAssert } from './any-assert';


/**
 * Map related assertions.
 */
export class SetAssert<V> extends AnyAssert<Set<V>> {
  private readonly setValue_: Set<V>;

  /**
   * @param setValue The value to assert.
   * @param reversed True iff the assertion logic should be reversed.
   * @param expect Reference to jasmine's expect function.'
   */
  constructor(
      setValue: Set<V>,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(setValue, reversed, expect);
    this.setValue_ = setValue;
  }

  /**
   * @param elements Elements that the set should have.
   */
  haveElements(elements: V[]): void {
    const value: V[] = Sets.of(this.setValue_).asArray();
    this.getMatchers_(value).toEqual(elements);
  }
}
// TODO: Mutable
