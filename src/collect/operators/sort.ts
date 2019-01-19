import { createGeneratorOperatorCopyAll } from '../create-operator';
import { toArray } from '../generators';
import { Ordering } from '../ordering';
import { GeneratorOperator } from '../types/operator';

export function sort<T, K>(ordering: Ordering<T>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => function *(): IterableIterator<T> {
    yield* toArray(from).sort(ordering);
  });
}
