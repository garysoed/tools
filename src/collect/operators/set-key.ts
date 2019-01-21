import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { getKey } from '../generators';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';

export function setKey<K, T>(...setSpecs: Array<[K, T]>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const setSpecMap = new Map(setSpecs);

    return exec(
        from,
        map(entry => {
          const newEntry = setSpecMap.get(getKey(from, entry));

          return newEntry === undefined ? entry : newEntry;
        }),
    );
  });
}
