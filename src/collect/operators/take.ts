import { Operator } from './operator';

/**
 * Returns {@link Array} with the first `count` elements from the {@link Iterable}.
 *
 * @typeParam T - Type of items.
 * @param count - Number of items to take.
 * @returns `Operator` that returns the first `count` elements from the `Iterable`.
 * @thModule collect.operators
 */
export function take<T>(count: number): Operator<Iterable<T>, readonly T[]> {
  return (fromIterable: Iterable<T>) => {
    const iterable = (function*(): Generator<T> {
      let i = 0;
      for (const item of fromIterable) {
        if (i >= count) {
          break;
        }
        yield item;
        i++;
      }
    })();

    return [...iterable];
  };
}
