import { copyMetadata } from '../generators';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { MappedTypeOperator, TypedOperator } from '../types/operator';

export function takeWhile<F, T extends F>(
    checkFn: (value: F) => value is T,
): MappedTypeOperator<F, T>;
export function takeWhile<T>(checkFn: (value: T) => boolean): TypedOperator<T>;
export function takeWhile<T>(checkFn: (value: T) => boolean): TypedOperator<T> {
  function operator<K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T> {
    return copyMetadata(
        function *(): IterableIterator<T> {
          let failed = false;
          for (const value of from()) {
            if (checkFn(value) && !failed) {
              yield value;
              continue;
            }

            failed = true;
          }
        },
        from,
    );
  }

  return operator;
}
