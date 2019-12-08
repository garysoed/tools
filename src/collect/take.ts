import { Operator } from './operator';

/**
 * Grabs the first `count` elements from the iterable.
 */
export function take(count: number): Operator<Iterable<any>, Iterable<any>> {
  return (fromIterable: Iterable<any>) => {
    return (function*(): Generator<any> {
      let i = 0;
      for (const item of fromIterable) {
        if (i >= count) {
          break;
        }
        yield item;
        i++;
      }
    })();
  };
}
