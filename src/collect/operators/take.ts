import { copyMetadata, countable } from '../generators';
import { transform } from '../transform';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { map } from './map';
import { takeWhile } from './take-while';
import { zip } from './zip';

export function take<T>(count: number): Operator<T> {
  function operator<K>(from: KeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator(from: TypedGenerator<T>): FiniteGenerator<T>;
  function operator(from: TypedGenerator<T>): FiniteGenerator<T> {
    const gen = transform(
        from,
        zip(countable()),
        takeWhile(([_, index]) => index < count),
        map(([value]) => value),
    );

    return Object.assign(copyMetadata(gen, from), {isFinite: true as true});
  }

  return operator;
}

interface Operator<T> {
  <K>(from: KeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  (from: TypedGenerator<T>): FiniteGenerator<T>;
}
