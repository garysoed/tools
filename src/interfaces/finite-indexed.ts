import { Finite } from './finite';
import { Indexed } from './indexed';

export interface FiniteIndexed<K, V> extends Finite, Indexed<K, V> {
  /**
   * @return True iff every item in the collection matches the given matcher.
   */
  every(check: (value: V, key: K) => boolean): boolean;

  findEntry(checker: (value: V, index: K) => boolean): [K, V] | null;

  findKey(checker: (value: V, index: K) => boolean): K | null;

  findValue(checker: (value: V, index: K) => boolean): V | null;

  /**
   * @return True iff the collection has the given key.
   */
  hasKey(key: K): boolean;

  reduce<R>(fn: (prevValue: R, value: V, key: K) => R, init: R): R;

  some(check: (value: V, key: K) => boolean): boolean;
}
