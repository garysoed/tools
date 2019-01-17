import { createGeneratorOperator } from '../create-operator';
import { transform } from '../transform';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';

export function deleteEntry<T, K = void>(...entries: T[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    const toDelete = new Set(entries);

    return transform(
        from,
        filter(entry => !toDelete.has(entry)),
    );
  });
}
