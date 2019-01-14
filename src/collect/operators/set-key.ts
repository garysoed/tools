import { copyMetadata } from '../generators';
import { transform } from '../transform';
import { FiniteKeyedGenerator, KeyedGenerator } from '../types/generator';
import { TypedKeyedOperator } from '../types/operator';
import { map } from './map';

export function setKey<K, T>(...setSpecs: Array<[K, T]>): TypedKeyedOperator<T, K> {
  function operator(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator(from: KeyedGenerator<K, T>): KeyedGenerator<K, T> {
    const setSpecMap = new Map(setSpecs);

    return copyMetadata(
        transform(
            from,
            map(entry => {
              const newEntry = setSpecMap.get(from.getKey(entry));

              return newEntry === undefined ? entry : newEntry;
            }),
        ),
        from,
    );
  }

  return operator;
}
