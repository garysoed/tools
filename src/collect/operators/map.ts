import { Operator } from './operator';

/**
 * Returns iterable with the values mapped from the given function.
 */
export function map<F, T>(mapFn: (from: F) => T): Operator<Iterable<F>, Iterable<T>> {
  return (fromIterable: Iterable<F>) => {
    return (function*(): Generator<T> {
      for (const item of fromIterable) {
        yield mapFn(item);
      }
    })();
  };
}
