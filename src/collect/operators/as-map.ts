import {Operator} from './operator';

/**
 * Converts the {@link Iterable} to a {@link Map}.
 *
 * @typeParam K - Type of keys in the map.
 * @typeParam V - Type of values in the map.
 * @returns `Operator` to convert `Iterable`s to maps.
 * @thModule collect.operators
 */
export function asMap<K, V>(): Operator<Iterable<readonly [K, V]>, Map<K, V>> {
  return iterable => new Map(iterable);
}
