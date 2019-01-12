import { transform } from '../transform';
import { KeyedGenerator } from './keyed-generator';
import { map } from './map';
import { TypedGenerator } from './typed-generator';

export function keys(): <K, T>(from: KeyedGenerator<K, T>) => TypedGenerator<K> {
  return <K, T>(from: KeyedGenerator<K, T>) => {
    return transform(from, map(entry => from.getKey(entry)));
  };
}
