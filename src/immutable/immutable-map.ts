import { FiniteIterableType } from '../check/finite-iterable-type';
import { InstanceofType } from '../check/instanceof-type';
import { ImmutableSet } from '../immutable/immutable-set';
import { Collection } from '../interfaces/collection';
import { Finite } from '../interfaces/finite';
import { FiniteIndexed } from '../interfaces/finite-indexed';
import { Indexed } from '../interfaces/indexed';
import { assertUnreachable } from '../typescript/assert-unreachable';

export class ImmutableMap<K, V> implements
    Collection<[K, V]>,
    Finite<[K, V]>,
    FiniteIndexed<K, V>,
    Indexed<K, V>,
    Iterable<[K, V]> {
  private readonly data_: Map<K, V>;

  private constructor(data: Map<K, V>) {
    this.data_ = new Map(data);
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this.data_[Symbol.iterator]();
  }

  add([key, value]: [K, V]): ImmutableMap<K, V> {
    return this.set(key, value);
  }

  addAll(items: Iterable<[K, V]> & Finite<[K, V]>): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    for (const [key, value] of items) {
      clone.set(key, value);
    }
    return new ImmutableMap(clone);
  }

  delete([key, value]: [K, V]): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    clone.delete(key);
    return new ImmutableMap(clone);
  }

  deleteAll(items: Iterable<[K, V]> & Finite<[K, V]>): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    for (const [key, value] of items) {
      clone.delete(key);
    }
    return new ImmutableMap(clone);
  }

  deleteAllKeys(keys: Iterable<K> & Finite<K>): ImmutableMap<K, V> {
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

  filter(checker: (value: V, index: K) => boolean): ImmutableMap<K, V> {
    return this.filterItem(([key, value]: [K, V]) => checker(value, key));
  }

  filterItem(checker: (item: [K, V]) => boolean): ImmutableMap<K, V> {
    return ImmutableMap.of(this.entries().filterItem(checker));
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
        .mapItem(([key, value]: [K, V]) => {
          return key;
        });
  }

  map<R>(fn: (value: V, index: K) => R): ImmutableMap<K, R> {
    return this.mapItem(([key, value]: [K, V]) => fn(value, key));
  }

  mapItem<R>(fn: (item: [K, V]) => R): ImmutableMap<K, R> {
    const mappedEntries = this.entries()
        .mapItem(([key, value]: [K, V]) => {
          return [key, fn([key, value])] as [K, R];
        });
    return ImmutableMap.of(mappedEntries);
  }

  set(key: K, item: V): ImmutableMap<K, V> {
    const clone = new Map(this.data_);
    clone.set(key, item);
    return new ImmutableMap(clone);
  }

  size(): number {
    return this.data_.size;
  }

  values(): ImmutableSet<V> {
    return this.entries()
        .mapItem(([key, value]: [K, V]) => {
          return value;
        });
  }

  static of<K, V>(data: Iterable<[K, V]> & Finite<[K, V]>): ImmutableMap<K, V>;
  static of<K, V>(data: [K, V][]): ImmutableMap<K, V>;
  static of<K, V>(data: (Iterable<[K, V]> & Finite<[K, V]>) | [K, V][]): ImmutableMap<K, V> {
    if (FiniteIterableType.check(data)) {
      return new ImmutableMap(new Map(data));
    } else if (InstanceofType(Array).check(data)) {
      return new ImmutableMap(new Map(data));
    } else {
      throw assertUnreachable(data);
    }
  }
}
