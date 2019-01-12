import { IterableFactory } from './iterable-factory';
import { Operator } from './operator';

export function setAt<T>(
    item: T,
    index: number,
): Operator<IterableFactory<T>, IterableFactory<T>> {
  return (from: IterableFactory<T>) => {
    return function *(): IterableIterator<T> {
      let i = 0;
      for (const value of from()) {
        yield i === index ? item : value;
        i++;
      }
    };
  };
}
