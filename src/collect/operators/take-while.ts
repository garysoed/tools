import {Operator} from '../../typescript/operator';

export function $takeWhile<T>(
    predicate: (value: T) => boolean,
): Operator<Iterable<T>, readonly T[]> {
  return (fromIterable: Iterable<T>) => {
    const iterator = fromIterable[Symbol.iterator]();
    const results: T[] = [];
    for (
      let result = iterator.next();
      !result.done && predicate(result.value);
      result = iterator.next()) {
      results.push(result.value);
    }

    return results;
  };
}
