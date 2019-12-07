import { createGeneratorOperatorCopyAll } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

export function skipWhile<F, T extends F, K>(
    checkFn: (value: F) => value is T,
): GeneratorOperator<F, K, T, K>;
export function skipWhile<T, K>(checkFn: (value: T) => boolean): GeneratorOperator<T, K, T, K>;
export function skipWhile<T, K>(checkFn: (value: T) => boolean): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => function *(): IterableIterator<T> {
    let failed = false;
    for (const value of from()) {
      if (checkFn(value) && !failed) {
        continue;
      }

      failed = true;
      yield value;
    }
  });
}
