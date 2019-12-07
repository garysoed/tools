import { createGeneratorOperatorCopySize } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

export function map<F, T, K>(mapFn: (from: F) => T): GeneratorOperator<F, K, T, K> {
  return createGeneratorOperatorCopySize(from => {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        yield mapFn(value);
      }
    };
  });
}
