import { TypedGenerator } from './typed-generator';
import { Operator } from './operator';

export function map<F, T>(
    mapFn: (from: F) => T,
): Operator<TypedGenerator<F>, TypedGenerator<T>> {
  return (from: TypedGenerator<F>) => {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        yield mapFn(value);
      }
    };
  };
}
