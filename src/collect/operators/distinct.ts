import { createGeneratorOperatorCopyAll } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

export function distinct<T, K>(
    hashFn: (value: T) => any = value => value,
): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    return function *(): IterableIterator<T> {
      const hashes = new Set();
      for (const value of from()) {
        const hash = hashFn(value);
        if (hashes.has(hash)) {
          continue;
        }

        yield value;
        hashes.add(hash);
      }
    };
  });
}
