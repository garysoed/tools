import { IterableFactory } from './iterable-factory';
import { Operator } from './operator';
import { skip } from './skip';
import { take } from './take';

export function insertAt<T>(
    item: T,
    index: number,
): Operator<IterableFactory<T>, IterableFactory<T>> {
  return (from: IterableFactory<T>) => {
    const before = take<T>(index)(from);
    const after = skip<T>(index)(from);

    return function *(): IterableIterator<T> {
      yield* before();
      yield item;
      yield* after();
    };
  };
}
