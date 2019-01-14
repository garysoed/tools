import { countable } from '../generators';
import { transform } from '../transform';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { TypedOperator } from '../types/operator';
import { map } from './map';
import { skipWhile } from './skip-while';
import { takeWhile } from './take-while';
import { zip } from './zip';

export function insertAt<T>(...insertions: Array<[T, number]>): TypedOperator<T> {
  function operator<K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T> {
    const zipped = zip<T, number>(countable())(from);

    return function *(): IterableIterator<T> {
      let rest = zipped;
      for (const [item, index] of insertions) {
        const before = transform(
            zipped,
            takeWhile(([_, i]) => i < index),
            map(([value]) => value),
        );
        rest = skipWhile(([_, i]) => i < index)(rest);
        yield* before();
        yield item;
      }
      yield* transform(rest, map(([value]) => value))();
    };
  }

  return operator;
}
