import { OrderedMap } from '../structures/ordered-map';

import { Operator } from './operator';

export function asOrderedMap<K, V>(): Operator<ReadonlyArray<[K, V]>, OrderedMap<K, V>> {
  return iterable => new OrderedMap(iterable);
}
