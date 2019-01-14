import { copyMetadata } from '../generators';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { MappedTypeOperator, TypedOperator } from '../types/operator';

export function filter<F, T extends F>(
    filterFn: (value: F) => value is T,
): MappedTypeOperator<F, T>;
export function filter<T>(filterFn: (value: T) => boolean): TypedOperator<T>;
export function filter<T>(filterFn: (value: T) => boolean): TypedOperator<T> {
  function operator<K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T> {
    return copyMetadata(
        function *(): IterableIterator<T> {
          for (const value of from()) {
            if (filterFn(value)) {
              yield value;
            }
          }
        },
        from,
    );
  }

  return operator;
}
