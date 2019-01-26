import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { Ordering } from '../ordering';
import { GeneratorOperator } from '../types/operator';
import { asArray } from './as-array';

export function sort<T, K>(ordering: Ordering<T>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => function *(): IterableIterator<T> {
    yield* exec(from, asArray()).sort(ordering);
  });
}
