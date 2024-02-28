import {Operator} from '../../typescript/operator';

/**
 * Combines two {@link Iterable}s together to form an `Iterable` of pairs made of each element in
 * the original `Iterable`s paired together in order.
 *
 * @remarks
 * If the `Iterable`s have different lengths, the returned `Iterable` will have the length of the
 * shorted one. The rest of the items will be ignored.
 *
 * @typeParam T1 - Type of the items in the first `Iterable`.
 * @typeParam T2 - Type of the items in the second `Iterable`.
 * @param other - `Iterable` to zip with.
 * @returns `Operator` that zips the input `Iterable` with the given `Iterable`.
 * @thModule collect.operators
 */
export function $zip<T1, T2>(
  other: Iterable<T2>,
): Operator<Iterable<T1>, Iterable<[T1, T2]>> {
  return (fromIterable) => {
    return (function* (): Generator<[T1, T2]> {
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
