import { Converter, Serializable } from 'nabu/export/main';
import { ImmutableMap } from '../collect/immutable-map';
import { iterableConverter } from './iterable-converter';
import { tupleConverter } from './tuple-converter';

export function mapConverter<K, V>(
    keyConverter: Converter<K, Serializable>,
    valueConverter: Converter<V, Serializable>,
): Converter<ImmutableMap<K, V>, Serializable> {
  return iterableConverter(
      contents => ImmutableMap.of(new Map([...contents])),
      tupleConverter([keyConverter, valueConverter]),
  );
}
