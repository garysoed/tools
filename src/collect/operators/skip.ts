import { Operator } from './operator';

/**
 * Skips the first `count` elements from the iterable.
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
