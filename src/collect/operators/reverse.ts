import { createGeneratorOperator } from '../create-operator';
import { assertFinite, isKeyed, upgradeToKeyed } from '../generators';
import { GeneratorOperator } from '../types/operator';

export function reverse<T, K>(): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperator(from => {
    assertFinite(from);

    const array = [...from()].reverse();
    const generator = function *(): IterableIterator<T> {
      for (const item of array) {
        yield item;
      }
    };
    if (isKeyed(from)) {
      return upgradeToKeyed(generator, value => from.getKey(value));
    }

    return generator;
  });
}
