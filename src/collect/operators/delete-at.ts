import { IterableFactory } from './iterable-factory';
import { Operator } from './operator';
import { skip } from './skip';
import { take } from './take';

export function deleteAt<T>(
    index: number,
): Operator<IterableFactory<T>, IterableFactory<T>> {
  return (from: IterableFactory<T>) => {
    const before = take<T>(index)(from);
    const after = skip<T>(index + 1)(from);

    return function *(): IterableIterator<T> {
      yield* before();
      yield* after();
    };
  };
}
