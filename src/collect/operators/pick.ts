import { createGeneratorOperatorCopySize } from '../create-operator';
import { exec } from '../exec';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';

export function pick<T extends any[], N extends keyof T, K>(
    index: N,
): GeneratorOperator<T, K, T[N], K> {
  return createGeneratorOperatorCopySize(from => exec(
      from,
      map(item => item[index]),
  ));
}

