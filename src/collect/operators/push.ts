import { createGeneratorOperator } from '../create-operator';
import { assertFinite } from '../generators';
import { GeneratorOperator } from '../types/operator';

export function push<T, K>(...items: T[]): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    assertFinite(from);

    return function *(): IterableIterator<T> {
      yield* from();
      for (const item of items) {
        yield item;
      }
    };
  });
}
