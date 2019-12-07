import { createGeneratorOperatorCopyAll } from '../create-operator';
import { pipe } from '../pipe';
import { countable } from '../generators';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';
import { skipWhile } from './skip-while';
import { zip } from './zip';

export function skip<T, K>(count: number): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => pipe(
      from,
      zip(countable()),
      skipWhile(([_, index]) => index < count),
      map(([value]) => value),
  ));
}
