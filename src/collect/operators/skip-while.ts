import { TypedGenerator } from '../typed-generator';

type Operator<F, T> = (from: TypedGenerator<F>) => TypedGenerator<T>;
export function skipWhile<T>(checkFn: (value: T) => boolean): Operator<T, T>;
export function skipWhile<F, T extends F>(checkFn: (value: F) => value is T): Operator<F, T>;
export function skipWhile<T>(checkFn: (value: T) => boolean): Operator<T, T> {
  return (from: TypedGenerator<T>) => {
    return function *(): IterableIterator<T> {
      let failed = false;
      for (const value of from()) {
        if (checkFn(value) && !failed) {
          continue;
        }

        failed = true;
        yield value;
      }
    };
  };
}
