import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { MappedTypeOperator } from '../types/operator';

export function map<F, T>(
    mapFn: (from: F) => T,
): MappedTypeOperator<F, T> {
  function operator<K>(from: FiniteKeyedGenerator<K, F>): FiniteKeyedGenerator<K, T>;
  function operator<K>(from: KeyedGenerator<K, F>): KeyedGenerator<K, T>;
  function operator(from: FiniteGenerator<F>): FiniteGenerator<T>;
  function operator(from: TypedGenerator<F>): TypedGenerator<T>;
  function operator(from: TypedGenerator<F>): TypedGenerator<T> {
    return function *(): IterableIterator<T> {
      for (const value of from()) {
        yield mapFn(value);
      }
    };
  }

  return operator;
}
