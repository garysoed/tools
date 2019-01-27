import { createGeneratorOperatorCopyAll } from '../create-operator';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';
import { asArray } from './as-array';

export function reverse<T, K>(): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => function *(): IterableIterator<T> {
    for (const item of pipe(from, asArray()).reverse()) {
      yield item;
    }
  });
}
