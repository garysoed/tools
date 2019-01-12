import { transform } from '../transform';
import { filter } from './filter';
import { KeyedGenerator } from './keyed-generator';
import { TypedGenerator } from './typed-generator';

export function getKey<K>(...keys: K[]): <T>(from: KeyedGenerator<K, T>) => TypedGenerator<T> {
  return <T>(from: KeyedGenerator<K, T>) => {
    const keySet = new Set(keys);

    return transform(from, filter(entry => keySet.has(from.getKey(entry))));
  };
}
