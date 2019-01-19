import { createGeneratorOperatorCopyAll } from '../create-operator';
import { getKey } from '../generators';
import { exec } from '../exec';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';

export function deleteKey<T, K>(...keys: K[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const keysSet = new Set(keys);

    return exec(from, filter(entry => !keysSet.has(getKey(from, entry))));
  });
}
