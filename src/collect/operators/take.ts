import { IterableFactory } from './iterable-factory';
import { Operator } from './operator';

export function take<T>(count: number): Operator<IterableFactory<T>, IterableFactory<T>> {
  return (from: IterableFactory<T>) => {
    return function *(): IterableIterator<T> {
      let i = 0;
      for (const value of from()) {
        if (i >= count) {
          break;
        }

        yield value;
        i++;
      }
    };
  };
}
