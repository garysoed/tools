import { createGeneratorOperatorCopyAll } from '../create-operator';
import { TypedGenerator } from '../types/generator';
import { GeneratorOperator } from '../types/operator';

export function concat<T, K>(target: TypedGenerator<T, K>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    return function *(): IterableIterator<T> {
      yield* from();
      yield* target();
    };
  });
}
