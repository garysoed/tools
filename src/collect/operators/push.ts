import { copyMetadata } from '../generators';
import { FiniteGenerator, FiniteKeyedGenerator } from '../types/generator';
import { TypedOperator } from '../types/operator';

export function push<T>(...items: T[]): TypedOperator<T, FiniteGenerator<T>> {
  function operator<K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<T> {
    return copyMetadata(
        function *(): IterableIterator<T> {
          yield* from();
          for (const item of items) {
            yield item;
          }
        },
        from,
    );
  }

  return operator;
}
