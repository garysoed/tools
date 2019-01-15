import { createGeneratorOperator } from '../create-operator';
import { assertKeyedGenerator } from '../generators';
import { transform } from '../transform';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';

export function setKey<K, T>(...setSpecs: Array<[K, T]>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    const fromGen = assertKeyedGenerator(from);
    const setSpecMap = new Map(setSpecs);

    return transform(
        fromGen,
        map(entry => {
          const newEntry = setSpecMap.get(fromGen.getKey(entry));

          return newEntry === undefined ? entry : newEntry;
        }),
    );
  });
}
