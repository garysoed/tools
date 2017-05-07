import { Finite } from '../interfaces/finite';
import { Indexed } from '../interfaces/indexed';

export interface FiniteIndexed<K, V> {
  hasKey(key: K): boolean;
}
