import { Operator } from './operator';

export function split<T>(
    count: number,
): Operator<Iterable<T>, readonly [readonly T[], Iterable<T>]> {
  return from => {
    const fromIterator = from[Symbol.iterator]();

    const taken: T[] = [];
    for (let i = 0; i < count; i++) {
      const result = fromIterator.next();
      if (!result.done) {
        taken.push(result.value);
      }
    }

    const rest = (function*(): Generator<T> {
      for (let result = fromIterator.next(); !result.done; result = fromIterator.next()) {
        yield result.value;
      }
    })();

    return [taken, rest];
  };
}
