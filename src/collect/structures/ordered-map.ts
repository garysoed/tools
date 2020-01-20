import { Ordering } from '../compare/ordering';
import { withMap } from '../compare/with-map';

import { Sortable } from './sortable';

export class OrderedMap<K, V> implements ReadonlyMap<K, V>, Sortable<[K, V]> {
  readonly [Symbol.toStringTag] = 'OrderedMap';

  private readonly _keys = this.source.map(([key]) => key);
  private readonly _map = new Map(this.source);

  constructor(private readonly source: ReadonlyArray<readonly [K, V]>) { }

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

  get size(): number {
    return this._keys.length;
  }

  clear(): void {
    this._keys.splice(0, this._keys.length);
    this._map.clear();
  }

  delete(key: K): boolean {
    const index = this._keys.indexOf(key);
    if (index < 0) {
      return false;
    }

    this._keys.splice(index, 1);
    this._map.delete(key);
    return true;
  }

  entries(): IterableIterator<[K, V]> {
    return this._keys.map(key => [key, getRequiredValue(this._map, key)] as [K, V]).values();
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void {
    for (const key of this._keys) {
      callbackfn(getRequiredValue(this._map, key), key, this._map);
    }
  }

  get(key: K): V|undefined {
    return this._map.get(key);
  }

  getAt(index: number): [K, V]|undefined {
    const key = this._keys[index];
    if (key === undefined) {
      return undefined;
    }

    return [key, getRequiredValue(this._map, key)];
  }

  has(key: K): boolean {
    return this._map.has(key);
  }

  keys(): IterableIterator<K> {
    return this._keys.values();
  }

  set(key: K, value: V): this {
    if (!this._map.has(key)) {
      this._keys.push(key);
    }

    this._map.set(key, value);
    return this;
  }

  sort(ordering: Ordering<[K, V]>): void {
    this._keys.sort(withMap(key => [key, this.get(key)!] as [K, V], ordering));
  }

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
