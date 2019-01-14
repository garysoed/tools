import { generatorFrom } from '../generators';
import { FiniteGenerator, FiniteKeyedGenerator } from '../types/generator';
import { UntypedOperator } from '../types/operator';

export function reverse(): UntypedOperator<FiniteGenerator<any>> {
  function operator<T, K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<T>(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator<T>(from: FiniteGenerator<T>): FiniteGenerator<T> {
    const array = [...from()].reverse();

    return generatorFrom(array);
  }

  return operator;
}
