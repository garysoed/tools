import { Operator } from './operator';

/**
 * Grabs the first `count` elements from the iterable.
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
