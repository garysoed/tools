import { TypedGenerator } from './typed-generator';
import { Operator } from './operator';

export function setAt<T>(
    item: T,
    index: number,
): Operator<TypedGenerator<T>, TypedGenerator<T>> {
  return (from: TypedGenerator<T>) => {
    return function *(): IterableIterator<T> {
      let i = 0;
      for (const value of from()) {
        yield i === index ? item : value;
        i++;
      }
    };
  };
}
