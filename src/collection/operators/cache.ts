import { createGeneratorOperatorCopyAll } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

export function cache<T, K>(debugName: string = ''): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const iterator = from();
    const cache: T[] = [];

    return function *(): IterableIterator<T> {
      yield* cache;

      let i = cache.length;
      for (const item of iterator) {
        if (i < cache.length) {
          yield cache[i];
        } else {
          cache.push(item);
          yield item;
        }

        i++;
      }
    };
  });
}
