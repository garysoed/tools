import { createGeneratorOperatorCopyAll } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

export function push<T, K>(...items: T[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    return function *(): IterableIterator<T> {
      yield* from();
      for (const item of items) {
        yield item;
      }
    };
  });
}
