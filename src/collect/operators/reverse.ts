import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { GeneratorOperator } from '../types/operator';
import { asArray } from './as-array';

export function reverse<T, K>(): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => function *(): IterableIterator<T> {
    for (const item of exec(from, asArray()).reverse()) {
      yield item;
    }
  });
}
