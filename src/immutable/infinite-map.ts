import { Collection } from '../immutable/collection';
import { GeneratedLinkedList } from '../immutable/generated-linked-list';
import { Indexed } from '../immutable/indexed';
import { InfiniteList } from '../immutable/infinite-list';
import { Iterables } from '../immutable/iterables';

export class InfiniteMap<K, V> implements Collection<[K, V]>, Indexed<K, V>, Iterable<[K, V]> {

  constructor(
      private readonly keys_: Iterable<K>,
      private readonly generator_: (key: K) => V) { }

  * [Symbol.iterator](): Iterator<[K, V]> {
    for (const entry of this.entries()) {
      yield entry;
    }
  }

  entries(): GeneratedLinkedList<[K, V]> {
    const keys = this.keys();
    const generator = this.generator_;
    return new GeneratedLinkedList<[K, V]>(Iterables.of(function*(): Iterator<[K, V]> {
      for (const key of keys) {
        yield [key, generator(key)];
      }
    }));
  }

  filter(checker: (item: V, key: K) => boolean): InfiniteMap<K, V> {
    const filteredKeys = this.entries()
        .filterItem(([key, value]: [K, V]) => {
          return checker(value, key);
        })
        .mapItem(([key, value]: [K, V]) => {
          return key;
        });
    return new InfiniteMap(filteredKeys, this.generator_);
  }

  filterItem(checker: (item: [K, V]) => boolean): InfiniteMap<K, V> {
    return this.filter((item: V, key: K) => {
      return checker([key, item]);
    });
  }

  get(key: K): V {
    return this.generator_(key);
  }

  keys(): GeneratedLinkedList<K> {
    return new GeneratedLinkedList<K>(this.keys_);
  }

  map<R>(fn: (item: V, key: K) => R): InfiniteMap<K, R> {
    return new InfiniteMap<K, R>(
        this.keys_,
        (key: K) => {
          return fn(this.generator_(key), key);
        });
  }

  mapItem<R>(fn: (item: [K, V]) => R): GeneratedLinkedList<R> {
    return new GeneratedLinkedList<R>(this.entries().mapItem(fn));
  }

  set(changedKey: K, item: V): InfiniteMap<K, V> {
    const generator = this.generator_;
    return new InfiniteMap(
        this.keys_,
        (key: K) => {
          return (changedKey === key) ? item : generator(key);
        });
  }

  values(): GeneratedLinkedList<V> {
    return this.entries().mapItem((entry: [K, V]) => entry[1]);
  }
}
