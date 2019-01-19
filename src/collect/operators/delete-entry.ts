import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';

export function deleteEntry<T, K = void>(...entries: T[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const toDelete = new Set(entries);

    return exec(
        from,
        filter(entry => !toDelete.has(entry)),
    );
  });
}
