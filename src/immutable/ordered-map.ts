import {
  Collection,
  CompareResult,
  FiniteCollection,
  FiniteIndexed,
  Ordered,
  Ordering } from '../interfaces';
import { ImmutableList } from './immutable-list';
import { ImmutableSet } from './immutable-set';
import { Orderings } from './orderings';

export class OrderedMap<K, V> implements
    FiniteCollection<[K, V]>,
    FiniteIndexed<K, V>,
    Ordered<[K, V]> {
  private readonly keys_: K[];
  private readonly map_: Map<K, V>;

  private constructor(keys: K[], map: Map<K, V>) {
    this.keys_ = keys.slice(0);
    this.map_ = new Map(map);
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this.entries()[Symbol.iterator]();
  }

  add([key, value]: [K, V]): OrderedMap<K, V> {
    if (this.map_.has(key)) {
      return this;
    }

    const keysClone = this.keys_.slice(0);
    keysClone.push(key);
    const mapClone = new Map(this.map_);
    mapClone.set(key, value);
    return new OrderedMap(keysClone, mapClone);
  }

  addAll(items: FiniteCollection<[K, V]>): OrderedMap<K, V> {
    const keysClone = this.keys_.slice(0);
    const mapClone = new Map(this.map_);
    const entriesToAdd = items.filterItem(([key, _]: [K, V]) => !this.hasKey(key));
    for (const [key, value] of entriesToAdd) {
      keysClone.push(key);
      mapClone.set(key, value);
    }
    return new OrderedMap(keysClone, mapClone);
  }

  delete(entry: [K, V]): OrderedMap<K, V> {
    return this.deleteAll(ImmutableSet.of([entry]));
  }

  deleteAll(items: FiniteCollection<[K, V]>): OrderedMap<K, V> {
    const keysClone = this.keys_.slice(0);
    const mapClone = new Map(this.map_);

    for (const [key, value] of items) {
      if (this.map_.get(key) !== value) {
        continue;
      }

      const index = keysClone.indexOf(key);
      if (index >= 0) {
        keysClone.splice(index, 1);
      }
      mapClone.delete(key);
    }
    return new OrderedMap(keysClone, mapClone);
  }

  deleteAllKeys(keys: FiniteCollection<K>): OrderedMap<K, V> {
    const keysClone = this.keys_.slice(0);
    const mapClone = new Map(this.map_);

    for (const key of keys) {
      const index = keysClone.indexOf(key);
      if (index >= 0) {
        keysClone.splice(index, 1);
      }
      mapClone.delete(key);
    }
    return new OrderedMap(keysClone, mapClone);
  }

  deleteAt(index: number): OrderedMap<K, V> {
    const keyToDelete = this.keys_[index];
    if (keyToDelete === undefined) {
      return this;
    }

    return this.deleteKey(keyToDelete);
  }

  deleteKey(key: K): OrderedMap<K, V> {
    return this.deleteAllKeys(ImmutableSet.of([key]));
  }

  entries(): ImmutableList<[K, V]> {
    return ImmutableList
        .of(this.keys_)
        .map((key: K) => {
          const value = this.map_.get(key);
          if (value === undefined) {
            throw new Error(`Data inconsistency detected: ${key} has undefined value`);
          }
          return [key, value] as [K, V];
        });
  }

  equals(other: Ordered<[K, V]>): boolean {
    if (this.size() !== other.size()) {
      return false;
    }

    for (let i = 0; i < this.size(); i++) {
      const [thisKey, thisValue] = this.getAt(i)!;
      const [otherKey, otherValue] = other.getAt(i)!;
      if (thisKey !== otherKey || thisValue !== otherValue) {
        return false;
      }
    }

    return true;
  }

  every(check: (value: V, key: K) => boolean): boolean {
    return this.everyItem(([key, value]: [K, V]) => {
      return check(value, key);
    });
  }

  everyItem(check: (item: [K, V]) => boolean): boolean {
    for (const entry of this) {
      if (!check(entry)) {
        return false;
      }
    }
    return true;
  }

  filter(checker: (value: V, index: K) => boolean): OrderedMap<K, V> {
    return this.filterItem(([key, value]: [K, V]) => checker(value, key));
  }

  filterItem(checker: (item: [K, V]) => boolean): OrderedMap<K, V> {
    const filteredEntries = this.entries().filterItem(checker);
    const keysClone = filteredEntries.mapItem(([key, _]: [K, V]) => key);
    const mapClone = new Map([...filteredEntries]);
    return new OrderedMap([...keysClone], mapClone);
  }

  find(check: (item: [K, V]) => boolean): [K, V] | null {
    return this.findEntry((value: V, index: K) => {
      return check([index, value]);
    });
  }

  findEntry(checker: (value: V, index: K) => boolean): [K, V] | null {
    for (const [index, value] of this.entries()) {
      if (checker(value, index)) {
        return [index, value];
      }
    }
    return null;
  }

  findKey(checker: (value: V, index: K) => boolean): K | null {
    const entry = this.findEntry(checker);
    return entry === null ? null : entry[0];
  }

  findValue(checker: (value: V, index: K) => boolean): V | null {
    const entry = this.findEntry(checker);
    return entry === null ? null : entry[1];
  }

  get(key: K): V | undefined {
    return this.map_.get(key);
  }

  getAt(index: number): [K, V] | undefined {
    const key = this.keys_[index];
    if (key === undefined) {
      return undefined;
    }

    const value = this.get(key);
    if (value === undefined) {
      return undefined;
    }

    return [key, value];
  }

  has([key, value]: [K, V]): boolean {
    return this.map_.get(key) === value;
  }

  hasKey(key: K): boolean {
    return this.map_.has(key);
  }

  insertAllAt(index: number, items: FiniteCollection<[K, V]> & Collection<[K, V]>):
      OrderedMap<K, V> {
    // Go through the items to add, and count the number of existing items that come before the
    // insertion index.
    let preInsertionCount = 0;
    for (const [key] of items) {
      const existingIndex = this.keys_.indexOf(key);
      if (existingIndex >= 0 && existingIndex < index) {
        preInsertionCount++;
      }
    }

    const keysToInsert = ImmutableSet.of(items).mapItem(([key]: [K, V]) => key);
    const keysClone = ImmutableList.of(this.keys_).insertAllAt(index, keysToInsert);
    const mapClone = new Map(this.map_);
    for (const [key, value] of items) {
      mapClone.set(key, value);
    }
    return new OrderedMap([...keysClone], mapClone);
  }

  insertAt(index: number, item: [K, V]): OrderedMap<K, V> {
    return this.insertAllAt(index, ImmutableSet.of([item]));
  }

  keys(): ImmutableList<K> {
    return this.entries()
        .mapItem(([key, _]: [K, V]) => {
          return key;
        });
  }

  map<R>(fn: (value: V, index: K) => R): OrderedMap<K, R> {
    return this.mapItem(([key, value]: [K, V]) => fn(value, key));
  }

  mapItem<R>(fn: (item: [K, V]) => R): OrderedMap<K, R> {
    const keysClone = this.keys_.slice(0);
    const mapClone = new Map();
    for (const [key, value] of this.map_) {
      mapClone.set(key, fn([key, value]));
    }
    return new OrderedMap(keysClone, mapClone);
  }

  max(ordering: Ordering<[K, V]>): [K, V] | null {
    return this.reduceItem<[K, V] | null>(
        (prevValue: [K, V] | null, currentEntry: [K, V]) => {
          if (prevValue === null) {
            return currentEntry;
          }

          if (ordering(prevValue, currentEntry) === -1) {
            return currentEntry;
          } else {
            return prevValue;
          }
        },
        null);
  }

  min(ordering: Ordering<[K, V]>): [K, V] | null {
    return this.max(Orderings.reverse(ordering));
  }

  reduce<R>(fn: (prevValue: R, value: V, key: K) => R, init: R): R {
    let result = init;
    for (const [key, value] of this) {
      result = fn(result, value, key);
    }
    return result;
  }

  reduceItem<R>(fn: (prevItem: R, item: [K, V]) => R, init: R): R {
    return this.reduce((prev: R, value: V, key: K) => {
      return fn(prev, [key, value]);
    }, init);
  }

  reverse(): OrderedMap<K, V> {
    return new OrderedMap(this.keys_.reverse(), new Map(this.map_));
  }

  set(key: K, value: V): OrderedMap<K, V> {
    const keysClone = this.keys_.slice(0);
    const mapClone = new Map(this.map_);
    mapClone.set(key, value);
    return new OrderedMap(keysClone, mapClone);
  }

  setAt(index: number, value: [K, V]): OrderedMap<K, V> {
    return this.deleteAt(index).insertAt(index, value);
  }

  size(): number {
    return this.keys_.length;
  }

  some(check: (value: V, key: K) => boolean): boolean {
    return this.someItem(([key, value]: [K, V]) => {
      return check(value, key);
    });
  }

  someItem(check: (item: [K, V]) => boolean): boolean {
    for (const entry of this) {
      if (check(entry)) {
        return true;
      }
    }
    return false;
  }

  sort(compareFn: (item1: [K, V], item2: [K, V]) => CompareResult): OrderedMap<K, V> {
    const keysClone = this.keys_.slice(0).sort((key1: K, key2: K) => {
      const value1 = this.get(key1);
      const value2 = this.get(key2);
      if (value1 === undefined) {
        throw new Error(`Data inconsistency detected: ${key1} has undefined value`);
      }
      if (value2 === undefined) {
        throw new Error(`Data inconsistency detected: ${key2} has undefined value`);
      }
      return compareFn([key1, value1], [key2, value2]);
    });
    return new OrderedMap(keysClone, new Map(this.map_));
  }

  values(): ImmutableList<V> {
    return this.entries()
        .mapItem(([_, value]: [K, V]) => {
          return value;
        });
  }

  static of<K, V>(entries: [K, V][]): OrderedMap<K, V> {
    const keys: K[] = [];
    const map = new Map();
    for (const [key, value] of entries) {
      if (!map.has(key)) {
        keys.push(key);
        map.set(key, value);
      }
    }

    return new OrderedMap(keys, map);
  }
}
