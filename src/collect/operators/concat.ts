import { createGeneratorOperatorCopyAll } from '../create-operator';
import { GeneratorOperator } from '../types/operator';
import { Stream } from '../types/stream';

export function concat<T, K>(target: Stream<T, K>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    return function *(): IterableIterator<T> {
      yield* from();
      yield* target();
    };
  });
}
