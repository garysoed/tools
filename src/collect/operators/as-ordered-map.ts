import { OrderedMap } from '../structures/ordered-map';

import { Operator } from './operator';

export function asOrderedMap<K, V>(): Operator<Iterable<[K, V]>, OrderedMap<K, V>> {
  return iterable => new OrderedMap([...iterable]);
}
