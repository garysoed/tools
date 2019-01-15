import { createGeneratorOperator } from '../create-operator';
import { countable } from '../generators';
import { transform } from '../transform';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';
import { skipWhile } from './skip-while';
import { zip } from './zip';

export function skip<T, K>(count: number): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => transform(
      from,
      zip(countable()),
      skipWhile(([_, index]) => index < count),
      map(([value]) => value),
  ));
}
