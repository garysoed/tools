import { createGeneratorOperatorCopyAll } from '../create-operator';
import { pipe } from '../pipe';
import { countable } from '../generators';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';
import { skipWhile } from './skip-while';
import { takeWhile } from './take-while';
import { zip } from './zip';

export function insertAt<T, K>(...insertions: Array<[T, number]>): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const zipped = zip<T, number, K>(countable())(from);

    return function *(): IterableIterator<T> {
      let rest = zipped;
      for (const [item, index] of insertions) {
        const before = pipe(
            zipped,
            takeWhile(([_, i]) => i < index),
            map(([value]) => value),
        );
        rest = skipWhile<[T, number], K>(([_, i]) => i < index)(rest);
        yield* before();
        yield item;
      }
      yield* pipe(rest, map(([value]) => value))();
    };
  });
}
