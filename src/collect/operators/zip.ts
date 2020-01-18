import { Operator } from './operator';

export function zip<T1, T2>(other: Iterable<T2>): Operator<Iterable<T1>, Iterable<[T1, T2]>> {
  return fromIterable => {
    return (function*(): Generator<[T1, T2]> {
      const otherIterator = other[Symbol.iterator]();
      let result = otherIterator.next();
      for (const item of fromIterable) {
        if (result.done) {
          break;
        }

        yield [item, result.value];
        result = otherIterator.next();
      }
    })();
  };
}
