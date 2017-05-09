import { Finite } from '../interfaces/finite';
import { Indexed } from '../interfaces/indexed';

export interface FiniteIndexed<K, V> {
  every(check: (value: V, key: K) => boolean): boolean;

  hasKey(key: K): boolean;

  reduce<R>(fn: (prevValue: R, value: V, key: K) => R, init: R): R;

  some(check: (value: V, key: K) => boolean): boolean;
}
// TODO: Mutable
