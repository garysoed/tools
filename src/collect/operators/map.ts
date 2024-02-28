import {Operator} from '../../typescript/operator';

/**
 * Maps each item in the given {@link Iterable} to another.
 *
 * @typeParam F - Original type of the items.
 * @typeParam T - Type of the mapped items.
 * @param mapFn - The mapping function
 * @returns `Operator` that maps each item in the original `Iterable`.
 * @thModule collect.operators
 */
export function $map<F, T>(
  mapFn: (from: F) => T,
): Operator<Iterable<F>, Iterable<T>> {
  return (fromIterable: Iterable<F>) => {
    return (function* (): Generator<T> {
      for (const item of fromIterable) {
        yield mapFn(item);
      }
    })();
  };
}
