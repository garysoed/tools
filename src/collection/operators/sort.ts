import { createGeneratorOperatorCopyAll } from '../create-operator';
import { Ordering } from '../ordering';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';
import { asArray } from './as-array';

export function sort<T, K>(ordering: Ordering<T>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => function *(): IterableIterator<T> {
    yield* pipe(from, asArray()).sort(ordering);
  });
}
