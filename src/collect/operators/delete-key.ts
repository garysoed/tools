import { createGeneratorOperator } from '../create-operator';
import { assertKeyedGenerator, copyMetadata } from '../generators';
import { transform } from '../transform';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';

export function deleteKey<T, K>(...keys: K[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    const keysSet = new Set(keys);
    const fromGen = assertKeyedGenerator(from);

    return transform(
        fromGen,
        filter(entry => !keysSet.has(fromGen.getKey(entry))),
    );
  });
}
