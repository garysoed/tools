import { IterableFactory } from './iterable-factory';
import { Operator } from './operator';

export function filter<T>(
    filterFn: (value: T) => boolean,
): Operator<IterableFactory<T>, IterableFactory<T>>;
export function filter<F, T>(
    filterFn: (value: F) => value is F,
): Operator<IterableFactory<F>, IterableFactory<T>>;
export function filter<T>(
    filterFn: (value: T) => boolean,
): Operator<IterableFactory<T>, IterableFactory<T>> {
  return (from: IterableFactory<T>) => {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        if (filterFn(value)) {
          yield value;
        }
      }
    };
  };
}
