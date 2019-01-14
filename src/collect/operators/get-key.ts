import { transform } from '../transform';
import { FiniteGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { filter } from './filter';
import { take } from './take';

export function getKey<K>(...keys: K[]): <T>(from: KeyedGenerator<K, T>) => FiniteGenerator<T> {
  return <T>(from: KeyedGenerator<K, T>) => {
    const keySet = new Set(keys);

    return transform<KeyedGenerator<K, T>, KeyedGenerator<K, T>, FiniteGenerator<T>>(
        from,
        filter(entry => keySet.has(from.getKey(entry))),
        take(keySet.size),
    );
  };
}
