import { transform } from '../transform';
import { filter } from './filter';
import { KeyedGenerator } from './keyed-generator';

export function deleteKey<K, T>(...keys: K[]):
    (from: KeyedGenerator<K, T>) => KeyedGenerator<K, T> {
  return (from: KeyedGenerator<K, T>) => {
    const keysSet = new Set(keys);

    return from.set(
        transform(from, filter(entry => !keysSet.has(from.getKey(entry)))),
    );
  };
}
