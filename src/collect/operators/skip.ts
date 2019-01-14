import { copyMetadata, countable } from '../generators';
import { transform } from '../transform';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { UntypedOperator } from '../types/operator';
import { map } from './map';
import { skipWhile } from './skip-while';
import { zip } from './zip';

export function skip(count: number): UntypedOperator {
  function operator<T, K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<T, K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator<T>(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator<T>(from: TypedGenerator<T>): TypedGenerator<T>;
  function operator<T>(from: TypedGenerator<T>): TypedGenerator<T> {
    return copyMetadata(
        transform(
            from,
            zip(countable()),
            skipWhile(([_, index]) => index < count),
            map(([value]) => value),
        ),
        from,
    );
  }

  return operator;
}
