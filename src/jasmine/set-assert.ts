import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { AnyAssert } from '../jasmine/any-assert';


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
    const value: V[] = Iterables.toArray(ImmutableSet.of(this.setValue_));
    this.getMatchers_(value).toEqual(elements);
  }
}
