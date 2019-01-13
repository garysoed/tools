import { TypedGenerator } from '../typed-generator';

export function scan<T, D>(
    fn: (prev: D, value: T) => D,
    init: D,
): (from: TypedGenerator<T>) => TypedGenerator<D> {
  return (from: TypedGenerator<T>) => {
    let result = init;

    return function *(): IterableIterator<D> {
      for (const value of from()) {
        result = fn(result, value);
        yield result;
      }
    };
  };
}
