import { createGeneratorOperatorCopyAll } from '../create-operator';
import { pipe } from '../pipe';
import { countable } from '../generators';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';
import { zip } from './zip';

export function setAt<T, K>(...setSpecs: Array<[number, T]>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const setSpecMap = new Map(setSpecs);

    return pipe(
        from,
        zip(countable()),
        map(([value, index]) => {
          if (index === undefined) {
            return value;
          }

          const setValue = setSpecMap.get(index);

          return setValue === undefined ? value : setValue;
        }),
    );
  });
}