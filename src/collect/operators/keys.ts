import { copyMetadata } from '../generators';
import { transform } from '../transform';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { map } from './map';

export function keys(): Operator {
  function operator<T, K>(from: FiniteKeyedGenerator<K, T>): FiniteGenerator<K>;
  function operator<T, K>(from: KeyedGenerator<K, T>): TypedGenerator<K>;
  function operator<T, K>(from: KeyedGenerator<K, T>): TypedGenerator<K> {
    return copyMetadata(
        transform(from, map(entry => from.getKey(entry))),
        from,
    );
  }

  return operator;
}

interface Operator {
  <T, K>(from: FiniteKeyedGenerator<K, T>): FiniteGenerator<K>;
  <T, K>(from: KeyedGenerator<K, T>): TypedGenerator<K>;
}
