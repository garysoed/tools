import { Operator } from './operator';

export function filter<T1, T2 extends T1>(filterFn: (item: T1) => item is T2):
    Operator<Iterable<T1>, Iterable<T2>>;
export function filter<T>(filterFn: (item: T) => boolean): Operator<Iterable<T>, Iterable<T>>;
export function filter<T>(filterFn: (item: T) => boolean): Operator<Iterable<T>, Iterable<T>> {
  return iterable => {
    return (function*(): Generator<T> {
      for (const item of iterable) {
        if (filterFn(item)) {
          yield item;
        }
      }
    })();
  };
}
