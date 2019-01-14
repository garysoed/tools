import { countable } from '../generators';
import { transform } from '../transform';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { UntypedOperator } from '../types/operator';
import { filter } from './filter';
import { map } from './map';
import { zip } from './zip';

export function deleteAt(...indexes: number[]): UntypedOperator {
  function operator<T, K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<T, K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator<T>(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator<T>(from: TypedGenerator<T>): TypedGenerator<T>;
  function operator<T>(from: TypedGenerator<T>): TypedGenerator<T> {
    const toDelete = new Set(indexes);

    return transform(
        from,
        zip(countable()),
        filter(([_, index]) => index === undefined || !toDelete.has(index)),
        map<[T, number], T>(([value]) => value),
    );
  }

  return operator;
}
