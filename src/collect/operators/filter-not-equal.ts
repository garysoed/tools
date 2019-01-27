import { createGeneratorOperatorCopyAll } from '../create-operator';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';

export function filterNotEqual<T, K, F extends T>(
    value: F,
): GeneratorOperator<T, K, Exclude<T, F>, K> {
  return createGeneratorOperatorCopyAll(from => pipe(
      from,
      filter((target): target is Exclude<T, F> => target !== value),
  ));
}
