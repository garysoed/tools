import { Finite } from '../interfaces/finite';
import { Indexed } from '../interfaces/indexed';

export interface FiniteIndexed<K, V> {
  /**
   * @return True iff every item in the collection matches the given matcher.
   */
  every(check: (value: V, key: K) => boolean): boolean;

  /**
   * @return True iff the collection has the given key.
   */
  hasKey(key: K): boolean;

  reduce<R>(fn: (prevValue: R, value: V, key: K) => R, init: R): R;

  some(check: (value: V, key: K) => boolean): boolean;
}
