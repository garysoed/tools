import { copyMetadata } from '../generators';
import { KeyedGenerator } from '../keyed-generator';
import { transform } from '../transform';
import { filter } from './filter';

export function deleteKey<K, T>(...keys: K[]):
    (from: KeyedGenerator<K, T>) => KeyedGenerator<K, T> {
  return (from: KeyedGenerator<K, T>) => {
    const keysSet = new Set(keys);

    return copyMetadata(
        transform(from, filter(entry => !keysSet.has(from.getKey(entry)))),
        from,
    );
  };
}
