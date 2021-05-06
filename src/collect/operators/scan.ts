import {Operator} from './operator';

export function $scan<F, T>(
    scanFn: (item: F, acc: T) => T,
    init: T,
): Operator<Iterable<F>, Iterable<T>> {
  return (fromIterable: Iterable<F>) => {
    return (function*(): Generator<T> {
      let acc: T = init;
      for (const item of fromIterable) {
        acc = scanFn(item, acc);
        yield acc;
      }
    })();
  };
}
