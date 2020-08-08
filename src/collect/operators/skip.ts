import { Operator } from './operator';

/**
 * Returns an {@link Iterable} that skips the first `count` elements from the `Iterable`.
 *
 * @typeParam T - Type of items in the `Iterable`.
 * @param count - Number of items to skip.
 * @returns `Operator` that skips the given number of items in the given `Iterable`.
 * @thModule collect.operators
 */
export function skip<T>(count: number): Operator<Iterable<T>, Iterable<T>> {
  return (fromIterable: Iterable<T>) => {
    return (function*(): Generator<T> {
      let i = 0;
      for (const item of fromIterable) {
        if (i >= count) {
          yield item;
        }
        i++;
      }
    })();
  };
}
