import {Index} from './index';

export interface Indexable<K, V> extends Iterable<[K, V]> {
  get(key: K): V;
  set(key: K, value: V): void;
}
