/**
 * Grabs the first `count` elements from the iterable.
 */
export function take<T>(count: number, iterable: Iterable<T>): Iterable<T> {
  return (function*(): Generator<T> {
    let i = 0;
    for (const item of iterable) {
      if (i >= count) {
        break;
      }
      yield item;
      i++;
    }
  })();
}
