import { createGeneratorOperatorCopyAll } from '../create-operator';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';
import { asArray } from './as-array';

export function eager<T, K>(): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const cache = pipe(from, asArray());

    return function *(): IterableIterator<T> {
      yield* cache;
    };
  });
}
