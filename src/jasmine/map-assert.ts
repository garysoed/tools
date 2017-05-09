import { Maps } from '../collection/maps';

import { AnyAssert } from './any-assert';


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
    const value: [K, V][] = Maps.of(this.mapValue_).entries().asArray();
    this.getMatchers_(value).toEqual(entries);
  }
}
// TODO: Mutable
