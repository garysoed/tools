import { TypedGenerator } from '../typed-generator';

export function map<F, T>(
    mapFn: (from: F) => T,
): (from: TypedGenerator<F>) => TypedGenerator<T> {
  return (from: TypedGenerator<F>) => {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        yield mapFn(value);
      }
    };
  };
}
