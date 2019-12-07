import { createGeneratorOperatorCopyAll } from '../create-operator';
import { countable } from '../generators';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';

import { declareFinite } from './declare-finite';
import { map } from './map';
import { takeWhile } from './take-while';
import { zip } from './zip';

export function take<T, K>(count: number): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    return pipe(
        from,
        zip(countable()),
        takeWhile(([_, index]) => index < count),
        map(([value]) => value),
        declareFinite(),
    );
  });
}
