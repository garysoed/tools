import { Operator } from './operator';

export function asMap<K, V>(): Operator<Iterable<[K, V]>, Map<K, V>> {
  return iterable => new Map(iterable);
}
