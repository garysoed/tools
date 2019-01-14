import { copyMetadata } from '../generators';
import { transform } from '../transform';
import { FiniteKeyedGenerator, KeyedGenerator } from '../types/generator';
import { UntypedOperator } from '../types/operator';
import { filter } from './filter';

export function deleteKey<K, T>(...keys: K[]): UntypedOperator<KeyedGenerator<K, T>> {
  function operator<T>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<T>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator<T>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T> {
    const keysSet = new Set(keys);

    return copyMetadata(transform(from, filter(entry => !keysSet.has(from.getKey(entry)))), from);
  }

  return operator;
}
