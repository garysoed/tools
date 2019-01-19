import { createGeneratorOperatorCopyAll } from '../create-operator';
import { toArray } from '../generators';
import { GeneratorOperator } from '../types/operator';

export function reverse<T, K>(): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => function *(): IterableIterator<T> {
    for (const item of toArray(from).reverse()) {
      yield item;
    }
  });
}
