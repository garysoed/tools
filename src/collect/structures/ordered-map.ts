import { Ordering } from '../compare/ordering';
import { withMap } from '../compare/with-map';

import { Sortable } from './sortable';

/**
 * Map whose entries are ordered.
 *
 * @typeParam K - Type of the keys in the `Map`.
 * @typeParam V - Type of the values in the `Map`.
 * @thModule collect.structures
 */
export class OrderedMap<K, V> implements ReadonlyMap<K, V>, Sortable<[K, V]> {
  readonly [Symbol.toStringTag] = 'OrderedMap';

  private readonly _keys = this.source.map(([key]) => key);
  private readonly _map = new Map(this.source);

  /**
   * @param source - Array of entry pairs of the map.
   */
  constructor(private readonly source: ReadonlyArray<readonly [K, V]> = []) { }

  /**
   * @returns {@link Iterator} for the map.
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    const keys = [...this._keys];
    const map = new Map(this._map);
    return (function*(): Generator<[K, V]> {
      for (const key of keys) {
        const value = getRequiredValue(map, key);
        yield [key, value];
      }
    })();
  }

  /**
   * @returns Number of elements in the map.
   */
  get size(): number {
    return this._keys.length;
  }

  /**
   * Removes all entries in the map.
   */
  clear(): void {
    this._keys.splice(0, this._keys.length);
    this._map.clear();
  }

  /**
   * Removes the entry corresponding to the given key.
   *
   * @param key - Key of the entry to delete.
   * @returns True iff deletion was successful.
   */
  delete(key: K): boolean {
    const index = this._keys.indexOf(key);
    if (index < 0) {
      return false;
    }

    this._keys.splice(index, 1);
    this._map.delete(key);
    return true;
  }

  /**
   * @returns {@link Iterator} that iterates all entries in the map.
   */
  entries(): IterableIterator<[K, V]> {
    return this._keys.map(key => [key, getRequiredValue(this._map, key)] as [K, V]).values();
  }

  /**
   * Calls the given function for every entry in the map.
   *
   * @remarks
   * The given function takes the `value` of the entry, `key` of the `entry` and a reference to the
   * map object.
   *
   * @param callbackfn - Function to call for every entry in the map.
   */
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void {
    for (const key of this._keys) {
      callbackfn(getRequiredValue(this._map, key), key, this._map);
    }
  }

  /**
   * @param key - Key of the entry to return.
   * @returns Value corresponding to the given key, or `undefined` if such value does not exist.
   */
  get(key: K): V|undefined {
    return this._map.get(key);
  }

  /**
   * @param index - Index of the entry to return.
   * @returns Entry at the given index, or undefined if none exists.
   */
  getAt(index: number): [K, V]|undefined {
    const key = this._keys[index];
    if (key === undefined) {
      return undefined;
    }

    return [key, getRequiredValue(this._map, key)];
  }

  /**
   * @param key - Key to check.
   * @returns True iff an entry corresponding to the given key exists in the map.
   */
  has(key: K): boolean {
    return this._map.has(key);
  }

  /**
   * @returns {@link Iterator} that iterates through the keys in the map.
   */
  keys(): IterableIterator<K> {
    return this._keys.values();
  }

  /**
   * @param key - Key of entry to set.
   * @param value - Value of the entry to set.
   * @returns The current instance of the map with the given key set to the given value.
   */
  set(key: K, value: V): this {
    if (!this._map.has(key)) {
      this._keys.push(key);
    }

    this._map.set(key, value);
    return this;
  }

  /**
   * Sorts the map with the given {@link Ordering}.
   *
   * @param ordering - `Ordering` to sort the map with.
   */
  sort(ordering: Ordering<[K, V]>): void {
    this._keys.sort(withMap(key => [key, this.get(key)!] as [K, V], ordering));
  }

  /**
   * @param start - Index to start modifying the map.
   * @param deleteCount - Number of entries starting at the given start index to delete.
   * @param toAdd - Entries to add at the given start index.
   * @returns Array of deleted entries.
   */
  splice(start: number, deleteCount: number, ...toAdd: ReadonlyArray<[K, V]>): Array<[K, V]> {
    const addedKeys = toAdd.map(([key]) => key);
    const deletedKeys = this._keys.splice(start, deleteCount, ...addedKeys);

    const deletedPairs: Array<[K, V]> = [];
    for (const deletedKey of deletedKeys) {
      const value = getRequiredValue(this._map, deletedKey);
      deletedPairs.push([deletedKey, value]);
      this._map.delete(deletedKey);
    }

    for (const [key, value] of toAdd) {
      this._map.set(key, value);
    }

    return deletedPairs;
  }

  /**
   * @returns {@link Iterator} that iterates through the values in the map.
   */
  values(): IterableIterator<V> {
    return this._keys.map(key => getRequiredValue(this._map, key)).values();
  }
}

function getRequiredValue<K, V>(map: ReadonlyMap<K, V>, key: K): V {
  const value = map.get(key);
  if (value === undefined) {
    throw new Error(`key ${key} is missing. Map has been corrupted.`);
  }

  return value;
}
