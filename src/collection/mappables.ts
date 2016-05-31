import {BaseFluent} from './base-fluent';
import {FluentIterable, Iterables} from './iterables';
import {IFluentMappable, IFluentNonIndexable} from './interfaces';
import {NonIndexables} from './non-indexables';


export class FluentMappable<K, V> extends BaseFluent<Map<K, V>> implements IFluentMappable<K, V> {

  constructor(map: Map<K, V>) {
    super(map);
  }

  addAll(other: Iterable<[K, V]>): FluentIterable<[K, V]> {
    return Iterables.of(this.data).addAll(other);
  }

  addAllArray(array: [K, V][]): FluentMappable<K, V> {
    return this.addAllMap(new Map<K, V>(array));
  }

  addAllMap(map: Map<K, V>): FluentMappable<K, V> {
    Iterables.of(map).iterate((entry: [K, V]) => {
      this.data.set(entry[0], entry[1]);
    });
    return this;
  }

  asIterable(): Iterable<[K, V]> {
    return this.data;
  }

  asIterator(): Iterator<[K, V]> {
    return this.data[Symbol.iterator]();
  }

  asMap(): Map<K, V> {
    return this.data;
  }

  asRecord(toString: (key: K) => string = (key: K) => String(key)): {[key: string]: V} {
    let record = <{[key: string]: V}> {};
    this.forEach((value: V, key: K) => {
      record[toString(key)] = value;
    });
    return record;
  }

  filter(fn: (value: [K, V]) => boolean): FluentMappable<K, V> {
    let filteredMap = new Map<K, V>();
    this.forEach((value: V, key: K) => {
      if (fn([key, value])) {
        filteredMap.set(key, value);
      }
    });
    return new FluentMappable<K, V>(filteredMap);
  }

  filterEntry(filterFn: (value: V, key: K) => boolean): FluentMappable<K, V> {
    return this.filter((entry: [K, V]) => {
      return filterFn(entry[1], entry[0]);
    });
  }

  findEntry(fn: (value: V, key: K) => boolean): [K, V] {
    let iterator = this.asIterator();
    for (let entry = iterator.next(); !entry.done; entry = iterator.next()) {
      if (fn(entry.value[1], entry.value[0])) {
        return entry.value;
      }
    }
    return null;
  }

  findKey(fn: (value: V, key: K) => boolean): K {
    let entry = this.findEntry(fn);
    return entry === null ? null : entry[0];
  }

  findValue(fn: (value: V, key: K) => boolean): V {
    let entry = this.findEntry(fn);
    return entry === null ? null : entry[1];
  }

  forEach(fn: (value: V, key: K) => void): FluentMappable<K, V> {
    this.data.forEach((value: V, key: K) => {
      fn(value, key);
    });
    return this;
  }

  forOf(fn: (value: V, key: K, breakFn: () => void) => void): FluentMappable<K, V> {
    Iterables.of(this.data).iterate((entry: [K, V], breakFn: () => void) => {
      fn(entry[1], entry[0], breakFn);
    });
    return this;
  }

  iterate(fn: (value: [K, V], breakFn: () => void) => void): FluentMappable<K, V> {
    Iterables.of(this.data).iterate(fn);
    return this;
  }

  keys(): IFluentNonIndexable<K> {
    let keys = [];
    this.forEach((value: V, key: K) => {
      keys.push(key);
    });
    return NonIndexables.of(keys);
  }

  map<K2, V2>(fn: (value: [K, V]) => [K2, V2]): FluentMappable<K2, V2> {
    let transformedMap = new Map<K2, V2>();
    this.forEach((value: V, key: K) => {
      let transformedEntry = fn([key, value]);
      transformedMap.set(transformedEntry[0], transformedEntry[1]);
    });
    return new FluentMappable<K2, V2>(transformedMap);
  }

  mapKey<K2>(fn: (value: V, key: K) => K2): FluentMappable<K2, V> {
    return this.map<K2, V>((entry: [K, V]) => {
      return [fn(entry[1], entry[0]), entry[1]];
    });
  }

  mapValue<V2>(fn: (value: V, key: K) => V2): FluentMappable<K, V2> {
    return this.map<K, V2>((entry: [K, V]) => {
      return [entry[0], fn(entry[1], entry[0])];
    });
  }

  removeAllKeys(toRemove: Set<K>): FluentMappable<K, V> {
    Iterables.of(toRemove).iterate((key: K) => {
      this.data.delete(key);
    });
    return this;
  }

  values(): IFluentNonIndexable<V> {
    let values = [];
    this.forEach((value: V, key: K) => {
      values.push(value);
    });
    return NonIndexables.of(values);
  }
}

export class Mappables {
  /**
   * Starts by using a map.
   *
   * @param <K> Type of the map key.
   * @param <V> Type of the map value.
   * @param map The map object to start with.
   * @return Map wrapper object to do operations on.
   */
  static of<K, V>(map: Map<K, V>): FluentMappable<K, V> {
    return new FluentMappable<K, V>(map);
  }
}
