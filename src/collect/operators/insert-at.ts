import { TypedGenerator } from './typed-generator';
import { Operator } from './operator';
import { skip } from './skip';
import { take } from './take';

export function insertAt<T>(
    item: T,
    index: number,
): Operator<TypedGenerator<T>, TypedGenerator<T>> {
  return (from: TypedGenerator<T>) => {
    const before = take<T>(index)(from);
    const after = skip<T>(index)(from);

    return function *(): IterableIterator<T> {
      yield* before();
      yield item;
      yield* after();
    };
  };
}
