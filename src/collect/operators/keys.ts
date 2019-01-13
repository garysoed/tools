import { KeyedGenerator } from '../keyed-generator';
import { transform } from '../transform';
import { TypedGenerator } from '../typed-generator';
import { map } from './map';

export function keys(): <K, T>(from: KeyedGenerator<K, T>) => TypedGenerator<K> {
  return <K, T>(from: KeyedGenerator<K, T>) => {
    return transform(from, map(entry => from.getKey(entry)));
  };
}
