import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { countable } from '../generators';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';
import { map } from './map';
import { zip } from './zip';

export function deleteAt<T, K>(...indexes: number[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const toDelete = new Set(indexes);

    return exec(
        from,
        zip(countable()),
        filter(([_, index]) => index === undefined || !toDelete.has(index)),
        map(([value]) => value),
    );
  });
}
