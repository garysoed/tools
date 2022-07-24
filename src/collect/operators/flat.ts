import {Operator} from '../../typescript/operator';

type FiniteIterable<T> = ReadonlySet<T>|readonly T[];

/**
 * Flattens the {@link Iterable} of `Iterable`s.
 *
 * @remarks
 * If the input value is an `Iterable` of {@link Map}s, the resulting `Iterable` will contain
 * `[key, value]` pairs of the maps.
 *
 * @typeParam T - Type of item in the given `Iterable`.
 * @returns `Operator` that flattens the `Iterable` of `Iterable`s..
 * @thModule collect.operators
 */
export function $flat<T>(): Operator<Iterable<FiniteIterable<T>>, Iterable<T>>;
/**
 * @typeParam K - Type of the keys in the input map.
 * @typeParam V - Type of the values in the input map.
 * @returns `Operator` that flattens an `Iterable` of Maps to `Iterable` of `[key, value]` tuples in
 *     the maps.
 */
export function $flat<K, V>(): Operator<Iterable<ReadonlyMap<K, V>>, Iterable<[K, V]>>;
export function $flat<T>(): Operator<Iterable<FiniteIterable<T>>, Iterable<T>> {
  return iterable => {
    return (function*(): Generator<T> {
      for (const innerIterable of iterable) {
        for (const item of innerIterable) {
          yield item;
        }
      }
    })();
  };
}
