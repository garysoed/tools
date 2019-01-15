import { createGeneratorOperator } from '../create-operator';
import { copyMetadata, countable } from '../generators';
import { transform } from '../transform';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';
import { map } from './map';
import { zip } from './zip';

export function deleteAt<T, K>(...indexes: number[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    const toDelete = new Set(indexes);

    return copyMetadata(
        transform(
            from,
            zip(countable()),
            filter(([_, index]) => index === undefined || !toDelete.has(index)),
            map(([value]) => value),
        ),
        from,
    );
  });
}
