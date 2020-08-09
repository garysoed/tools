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
  /**
   * Default tag when stringifying `OrderedMap`.
   */
  readonly [Symbol.toStringTag] = 'OrderedMap';

  private readonly keys_ = this.source.map(([key]) => key);
  private readonly map_ = new Map(this.source);

  /**
   * @param source - Array of entry pairs of the map.
   */
  constructor(private readonly source: ReadonlyArray<readonly [K, V]> = []) { }

  /**
   * Iterates through the entries in the map.
   *
   * @returns {@link Iterator} for the map.
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    const keys = [...this.keys_];
    const map = new Map(this.map_);
    return (function*(): Generator<[K, V]> {
      for (const key of keys) {
        const value = getRequiredValue(map, key);
        yield [key, value];
      }
    })();
  }

  /**
   * Number of elements in the map.
   */
  get size(): number {
    return this.keys_.length;
  }

  /**
   * Removes all entries in the map.
   */
  clear(): void {
    this.keys_.splice(0, this.keys_.length);
    this.map_.clear();
  }

  /**
   * Removes the entry corresponding to the given key.
   *
   * @param key - Key of the entry to delete.
   * @returns True iff deletion was successful.
   */
  delete(key: K): boolean {
    const index = this.keys_.indexOf(key);
    if (index < 0) {
      return false;
    }

    this.keys_.splice(index, 1);
    this.map_.delete(key);
    return true;
  }

  /**
   * Returns all entries in the map.
   *
   * @returns {@link Iterator} that iterates all entries in the map.
   */
  entries(): IterableIterator<[K, V]> {
    return this.keys_.map(key => [key, getRequiredValue(this.map_, key)] as [K, V]).values();
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
    for (const key of this.keys_) {
      callbackfn(getRequiredValue(this.map_, key), key, this.map_);
    }
  }

  /**
   * Returns value corresponding to the given key.
   *
   * @remarks
   * Returns `undefined` if the value doesn't exist.
   *
   * @param key - Key of the entry to return.
   * @returns Value corresponding to the given key, or `undefined` if such value does not exist.
   */
  get(key: K): V|undefined {
    return this.map_.get(key);
  }

  /**
   * Returns entry at the given index.
   *
   * @remarks
   * Returns `undefined` if the value doesn't exist.
   *
   * @param index - Index of the entry to return.
   * @returns Entry at the given index, or undefined if none exists.
   */
  getAt(index: number): [K, V]|undefined {
    const key = this.keys_[index];
    if (key === undefined) {
      return undefined;
    }

    return [key, getRequiredValue(this.map_, key)];
  }

  /**
   * Returns true iff entry corresponding to the key exists.
   *
   * @param key - Key to check.
   * @returns True iff an entry corresponding to the given key exists in the map.
   */
  has(key: K): boolean {
    return this.map_.has(key);
  }

  /**
   * Returns keys in the map.
   *
   * @returns {@link Iterator} that iterates through the keys in the map.
   */
  keys(): IterableIterator<K> {
    return this.keys_.values();
  }

  /**
   * Sets the entry with the given `key` to the given `value`.
   *
   * @param key - Key of entry to set.
   * @param value - Value of the entry to set.
   * @returns The current instance of the map with the given key set to the given value.
   */
  set(key: K, value: V): this {
    if (!this.map_.has(key)) {
      this.keys_.push(key);
    }

    this.map_.set(key, value);
    return this;
  }

  /**
   * Sorts the map with the given {@link Ordering}.
   *
   * @param ordering - `Ordering` to sort the map with.
   */
  sort(ordering: Ordering<[K, V]>): void {
    this.keys_.sort(withMap(key => [key, this.get(key)!] as [K, V], ordering));
  }

  /**
   * Modifies the map by deleting and adding entries to the map.
   *
   * @param start - Index to start modifying the map.
   * @param deleteCount - Number of entries starting at the given start index to delete.
   * @param toAdd - Entries to add at the given start index.
   * @returns Array of deleted entries.
   */
  splice(start: number, deleteCount: number, ...toAdd: ReadonlyArray<[K, V]>): Array<[K, V]> {
    const addedKeys = toAdd.map(([key]) => key);
    const deletedKeys = this.keys_.splice(start, deleteCount, ...addedKeys);

    const deletedPairs: Array<[K, V]> = [];
    for (const deletedKey of deletedKeys) {
      const value = getRequiredValue(this.map_, deletedKey);
      deletedPairs.push([deletedKey, value]);
      this.map_.delete(deletedKey);
    }

    for (const [key, value] of toAdd) {
      this.map_.set(key, value);
    }

    return deletedPairs;
  }

  /**
   * Returns values in the map.
   *
   * @returns {@link Iterator} that iterates through the values in the map.
   */
  values(): IterableIterator<V> {
    return this.keys_.map(key => getRequiredValue(this.map_, key)).values();
  }
}

function getRequiredValue<K, V>(map: ReadonlyMap<K, V>, key: K): V {
  const value = map.get(key);
  if (value === undefined) {
    throw new Error(`key ${key} is missing. Map has been corrupted.`);
  }

  return value;
}
