import {Operator} from '../../typescript/operator';
import {OrderedMap} from '../structures/ordered-map';


/**
 * Converts the {@link Iterable} to an {@link OrderedMap}.
 *
 * @typeParam K - Type of keys in the map.
 * @typeParam V - Type of values in the map.
 * @returns `Operator` to convert `Iterable`s to `OrderedMap`s.
 * @thModule collect.operators
 */
export function $asOrderedMap<K, V>(): Operator<Iterable<[K, V]>, OrderedMap<K, V>> {
  return iterable => new OrderedMap([...iterable]);
}
