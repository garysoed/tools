import { createGeneratorOperator } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

export function scan<T, D, K>(
    fn: (prev: D, value: T) => D,
    init: D,
): GeneratorOperator<T, K, D, K> {
  return createGeneratorOperator(from => {
    let result = init;

    return function *(): IterableIterator<D> {
      for (const value of from()) {
        result = fn(result, value);
        yield result;
      }
    };
  });
}
