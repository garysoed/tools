import { IterableFactory } from './iterable-factory';
import { Operator } from './operator';

export function map<F, T>(
    mapFn: (from: F) => T,
): Operator<IterableFactory<F>, IterableFactory<T>> {
  return (from: IterableFactory<F>) => {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        yield mapFn(value);
      }
    };
  };
}
