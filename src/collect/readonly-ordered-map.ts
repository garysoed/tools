export interface ReadonlyOrderedMap<K, V> extends ReadonlyMap<K, V> {
  readonly size: number;

  getAt(index: number): [K, V]|undefined;
}
