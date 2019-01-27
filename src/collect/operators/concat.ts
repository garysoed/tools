import { createGeneratorOperatorCopyKey } from '../create-operator';
import { GeneratorOperator } from '../types/operator';
import { Stream } from '../types/stream';

/**
 * Concatenates the given stream.
 * @param target Stream to concatenate to the existing Stream.
 */
export function concat<T, K>(target: Stream<T, K>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyKey(from => {
    return function *(): IterableIterator<T> {
      yield* from();
      yield* target();
    };
  });
}
