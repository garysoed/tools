/**
 * {@link OrderedMap} that cannot be modified
 *
 * @typeParam K - Type of keys in the map.
 * @typeParam V - Type of values in the map.
 * @thModule collect.structures
 */
export interface ReadonlyOrderedMap<K, V> extends ReadonlyMap<K, V> {
  /**
   * @returns Number of entries in the map.
   */
  readonly size: number;

  /**
   * @param index - Index to return the entries at
   * @returns The entry at the given index, or `undefined` if none exists.
   */
  getAt(index: number): [K, V] | undefined;
}
