import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';

export function filterNotEqual<T, K, F extends T>(
    value: F,
): GeneratorOperator<T, K, Exclude<T, F>, K> {
  return createGeneratorOperatorCopyAll(from => exec(
      from,
      filter((target): target is Exclude<T, F> => target !== value),
  ));
}
