import { TypedGenerator } from './typed-generator';
import { Operator } from './operator';

export function filter<T>(
    filterFn: (value: T) => boolean,
): Operator<TypedGenerator<T>, TypedGenerator<T>>;
export function filter<F, T>(
    filterFn: (value: F) => value is F,
): Operator<TypedGenerator<F>, TypedGenerator<T>>;
export function filter<T>(
    filterFn: (value: T) => boolean,
): Operator<TypedGenerator<T>, TypedGenerator<T>> {
  return (from: TypedGenerator<T>) => {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        if (filterFn(value)) {
          yield value;
        }
      }
    };
  };
}
