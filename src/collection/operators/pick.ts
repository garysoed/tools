import { createGeneratorOperatorCopySize } from '../create-operator';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';

export function pick<T, N extends keyof T, K>(
    index: N,
): GeneratorOperator<T, K, T[N], void> {
  return createGeneratorOperatorCopySize(from => pipe(
      from,
      map(item => item[index]),
  ));
}

