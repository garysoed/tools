import { Operator } from './operator';

type FiniteIterable<T> = ReadonlySet<T>|readonly T[];

export function flat<T>(): Operator<Iterable<FiniteIterable<T>>, Iterable<T>>;
export function flat<K, V>(): Operator<Iterable<ReadonlyMap<K, V>>, Iterable<[K, V]>>;
export function flat<T>(): Operator<Iterable<FiniteIterable<T>>, Iterable<T>> {
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
