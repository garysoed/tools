import {Operator} from '../../typescript/operator';

export function $scan<F, T>(
    scanFn: (acc: T, item: F) => T,
    init: T,
): Operator<Iterable<F>, Iterable<T>> {
  return (fromIterable: Iterable<F>) => {
    return (function*(): Generator<T> {
      let acc: T = init;
      for (const item of fromIterable) {
        acc = scanFn(acc, item);
        yield acc;
      }
    })();
  };
}
