import { createGeneratorOperator } from '../create-operator';
import { assertKeyedGenerator } from '../generators';
import { transform } from '../transform';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';
import { take } from './take';

export function getKey<T, K>(...keys: K[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    const fromGen = assertKeyedGenerator(from);
    const keySet = new Set(keys);

    return transform(
        fromGen,
        filter(entry => keySet.has(fromGen.getKey(entry))),
        take(keySet.size),
    );
  });
}
