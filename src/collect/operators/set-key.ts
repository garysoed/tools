import { createGeneratorOperatorCopyAll } from '../create-operator';
import { getKey } from '../generators';
import { GeneratorOperator } from '../types/operator';

export function setKey<K, T>(...setSpecs: Array<[K, T]>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const setSpecMap = new Map(setSpecs);
    const toSetKeys = new Set(setSpecs.map(([key]) => key));
    return function *(): IterableIterator<T> {
      for (const entry of from()) {
        const key = getKey(from, entry);
        const newEntry = setSpecMap.get(key);
        if (newEntry === undefined) {
          yield entry;
        } else {
          yield newEntry;
          toSetKeys.delete(key);
        }
      }

      for (const key of toSetKeys) {
        const value = setSpecMap.get(key);
        if (value !== undefined) {
          yield value;
        }
      }
    };
  });
}
