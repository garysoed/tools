import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { MappedTypeOperator } from '../types/operator';

export function scan<T, D>(
    fn: (prev: D, value: T) => D,
    init: D,
): MappedTypeOperator<T, D> {
  function operator<K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, D>;
  function operator<K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, D>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<D>;
  function operator(from: TypedGenerator<T>): TypedGenerator<D>;
  function operator(from: TypedGenerator<T>): TypedGenerator<D> {
    let result = init;

    return function *(): IterableIterator<D> {
      for (const value of from()) {
        result = fn(result, value);
        yield result;
      }
    };
  }

  return operator;
}
