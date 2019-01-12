import { TypedGenerator } from './typed-generator';

type Operator<F, T> = (from: TypedGenerator<F>) => TypedGenerator<T>;
export function takeWhile<T>(checkFn: (value: T) => boolean): Operator<T, T>;
export function takeWhile<F, T extends F>(checkFn: (value: F) => value is T): Operator<F, T>;
export function takeWhile<T>(checkFn: (value: T) => boolean): Operator<T, T> {
  return (from: TypedGenerator<T>) => {
    return function *(): IterableIterator<T> {
      let failed = false;
      for (const value of from()) {
        if (checkFn(value) && !failed) {
          yield value;
          continue;
        }

        failed = true;
      }
    };
  };
}
