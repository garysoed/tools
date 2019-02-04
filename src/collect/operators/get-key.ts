import { createGeneratorOperatorCopyAll } from '../create-operator';
import { getKey as getKeyFromGenerator } from '../generators';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';
import { take } from './take';

export function getKey<K, T>(...keys: K[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const keySet = new Set(keys);

    return pipe(
        from,
        filter(entry => keySet.has(getKeyFromGenerator(from, entry))),
        take(keySet.size),
    );
  });
}
