import { AnyType, ArrayOfType, IterableOfType, TupleOfType, Type } from 'gs-types/export';
import { FiniteCollection, FiniteIndexed, Ordering } from '../interfaces';
import { ImmutableSet } from './immutable-set';
import { OrderedMap } from './ordered-map';
import { Orderings } from './orderings';

export class ImmutableMap<K, V> implements
    FiniteCollection<[K, V]>,
    FiniteIndexed<K, V> {
  private readonly data_: Map<K, V>;

  constructor(data: Map<K, V>) {
    this.data_ = new Map(data);
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this.data_[Symbol.iterator]();
  }

  add([key, value]: [K, V]): ImmutableMap<K, V> {
    return this.set(key, value);
  }

  addAll(items: FiniteCollection<[K, V]>): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    for (const [key, value] of items) {
      clone.set(key, value);
    }

    return new ImmutableMap(clone);
  }

  delete([key, _]: [K, V]): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    clone.delete(key);

    return new ImmutableMap(clone);
  }

  deleteAll(items: FiniteCollection<[K, V]>): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    for (const [key, _] of items) {
      clone.delete(key);
    }

    return new ImmutableMap(clone);
  }

  deleteAllKeys(keys: FiniteCollection<K>): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    for (const key of keys) {
      clone.delete(key);
    }

    return new ImmutableMap(clone);
  }

  deleteKey(key: K): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    clone.delete(key);

    return new ImmutableMap(clone);
  }

  entries(): ImmutableSet<[K, V]> {
    return ImmutableSet.of<[K, V]>(this);
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

  filter(checker: (value: V, index: K) => boolean): ImmutableMap<K, V> {
    return this.filterItem(([key, value]: [K, V]) => checker(value, key));
  }

  filterByType<T2>(checker: Type<T2>): ImmutableSet<T2> {
    const newItems: T2[] = [];
    for (const item of this) {
      if (checker.check(item)) {
        newItems.push(item);
      }
    }

    return ImmutableSet.of(newItems);
  }

  filterItem(checker: (item: [K, V]) => boolean): ImmutableMap<K, V> {
    return ImmutableMap.of(this.entries().filterItem(checker));
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

  get(index: K): V | undefined {
    return this.data_.get(index);
  }

  has([key, value]: [K, V]): boolean {
    return this.data_.get(key) === value;
  }

  hasKey(key: K): boolean {
    return this.data_.has(key);
  }

  keys(): ImmutableSet<K> {
    return this.entries()
        .mapItem(([key, _]: [K, V]) => {
          return key;
        });
  }

  map<R>(fn: (value: V, index: K) => R): ImmutableMap<K, R> {
    const mappedEntries = this.entries()
        .mapItem(([key, value]: [K, V]) => {
          return [key, fn(value, key)] as [K, R];
        });

    return ImmutableMap.of(mappedEntries);
  }

  mapItem<R>(fn: (item: [K, V]) => R): ImmutableSet<R> {
    const mappedEntries = this.entries()
        .mapItem(([key, value]: [K, V]) => {
          return fn([key, value]);
        });

    return ImmutableSet.of(mappedEntries);
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
    let result: R = init;
    for (const [key, value] of this.data_) {
      result = fn(result, value, key);
    }

    return result;
  }

  reduceItem<R>(fn: (prevItem: R, item: [K, V]) => R, init: R): R {
    return this.reduce((prevValue: R, value: V, key: K) => {
      return fn(prevValue, [key, value]);
    },                 init);
  }

  set(key: K, item: V): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    clone.set(key, item);

    return new ImmutableMap(clone);
  }

  setForTest(key: K, value: V): void {
    this.data_.set(key, value);
  }

  size(): number {
    return this.data_.size;
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

  sort(ordering: Ordering<[K, V]>): OrderedMap<K, V> {
    return OrderedMap.of([...this.entries().sort(ordering)]);
  }

  toString(): string {
    return `ImmutableMap()`;
  }

  values(): ImmutableSet<V> {
    return this.entries()
        .mapItem(([_, value]: [K, V]) => {
          return value;
        });
  }

  static of<K, V>(): ImmutableMap<K, V>;
  static of<K, V>(data: FiniteCollection<[K, V]>|Iterable<[K, V]>): ImmutableMap<K, V>;
  static of<V>(data: {[key: string]: V}): ImmutableMap<string, V>;
  static of(data: {[key: string]: any}): ImmutableMap<string, any>;
  static of<K, V>(
        data: FiniteCollection<[K, V]> | [K, V][] | {[key: string]: any} | Map<K, V> = []):
      ImmutableMap<any, any> {
    if (IterableOfType(AnyType()).check(data)) {
      return new ImmutableMap(new Map(data));
    } else if (ArrayOfType(TupleOfType<K, V>([AnyType(), AnyType()])).check(data)) {
      return new ImmutableMap(new Map(data));
    } else if (data instanceof Map) {
      return new ImmutableMap(new Map(data));
    } else {
      const entries: [string, any][] = [];
      for (const key in data) {
        entries.push([key, data[key]]);
      }
      return new ImmutableMap(new Map(entries));
    }
  }
}
