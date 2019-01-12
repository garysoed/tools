import { countable } from '../generators';
import { transform } from '../transform';
import { map } from './map';
import { skipWhile } from './skip-while';
import { takeWhile } from './take-while';
import { TypedGenerator } from './typed-generator';
import { zip } from './zip';

export function insertAt<T>(...insertions: Array<[T, number]>):
    (from: TypedGenerator<T>) => TypedGenerator<T> {
  return (from: TypedGenerator<T>) => {
    const zipped = zip(countable())(from);

    return function *(): IterableIterator<T> {
      let rest = zipped;
      for (const [item, index] of insertions) {
        const before = transform(
            takeWhile(([_, i]) => i < index)(rest),
            map(([value]) => value),
        );
        rest = skipWhile(([_, i]) => i < index)(rest);
        yield* before();
        yield item;
      }
      yield* transform(rest, map(([value]) => value))();
    };
  };
}
