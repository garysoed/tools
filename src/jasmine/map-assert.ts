import { ImmutableMap } from '../immutable';
import { AnyAssert } from '../jasmine/any-assert';


/**
 * Map related assertions.
 */
export class MapAssert<K, V> extends AnyAssert<Map<K, V>> {
  private mapValue_: Map<K, V>;

  /**
   * @param mapValue The value to assert.
   * @param reversed True iff the assertion logic should be reversed.
   * @param expect Reference to jasmine's expect function.'
   */
  constructor(
      mapValue: Map<K, V>,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(mapValue, reversed, expect);
    this.mapValue_ = mapValue;
  }

  /**
   * @param entries Entries that the map should have.
   */
  haveEntries(entries: [K, V][]): void {
    this.getMatchers_([...ImmutableMap.of(this.mapValue_).entries()]).toEqual(entries);
  }
}
