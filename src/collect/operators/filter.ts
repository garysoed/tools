import { createGeneratorOperator } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

export function filter<F, T extends F, K>(
    filterFn: (value: F) => value is T,
): GeneratorOperator<F, K, T, K>;
export function filter<T, K>(filterFn: (value: T) => boolean): GeneratorOperator<T, K, T, K>;
export function filter<T, K>(filterFn: (value: T) => boolean): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        if (filterFn(value)) {
          yield value;
        }
      }
    };
  });
}
