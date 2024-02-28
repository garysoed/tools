import {Operator} from '../../typescript/operator';

/**
 * Splits the {@link Iterable} into an {@link Array} containing `count` items and `Iterable`
 * containing the rest of the items.
 *
 * @typeParam T - Type of items in the `Iterable`.
 * @param count - Number of items in the array.
 * @returns `Operator` that splits the `Iterable`.
 * @thModule collect.operators
 */
export function split<T>(
  count: number,
): Operator<Iterable<T>, readonly [readonly T[], Iterable<T>]> {
  return (from) => {
    const fromIterator = from[Symbol.iterator]();

    const taken: T[] = [];
    for (let i = 0; i < count; i++) {
      const result = fromIterator.next();
      if (!result.done) {
        taken.push(result.value);
      }
    }

    const rest = (function* (): Generator<T> {
      for (
        let result = fromIterator.next();
        !result.done;
        result = fromIterator.next()
      ) {
        yield result.value;
      }
    })();

    return [taken, rest];
  };
}
