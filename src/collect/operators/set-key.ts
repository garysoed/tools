import { transform } from '../transform';
import { KeyedGenerator } from './keyed-generator';
import { map } from './map';

export function setKey<K, T>(...setSpecs: Array<[K, T]>):
    (from: KeyedGenerator<K, T>) => KeyedGenerator<K, T> {
  return (from: KeyedGenerator<K, T>) => {
    const setSpecMap = new Map(setSpecs);

    return from.set(
        transform(
            from,
            map(entry => {
              const newEntry = setSpecMap.get(from.getKey(entry));

              return newEntry === undefined ? entry : newEntry;
            }),
        ),
    );
  };
}
