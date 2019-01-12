import { TypedGenerator } from './typed-generator';

type GeneratorOperator<F, T> = (from: TypedGenerator<F>) => TypedGenerator<T>;

export function filter<F, T extends F>(
    filterFn: (value: F) => value is T,
): GeneratorOperator<F, T>;
export function filter<T>(filterFn: (value: T) => boolean): GeneratorOperator<T, T>;
export function filter<T>(filterFn: (value: T) => boolean): GeneratorOperator<T, T> {
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
