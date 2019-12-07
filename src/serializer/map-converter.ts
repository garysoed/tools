import { Converter, Serializable } from '@nabu';

import { createImmutableMap, ImmutableMap } from '../collection/types/immutable-map';

import { iterableConverter } from './iterable-converter';
import { tupleConverter } from './tuple-converter';

export function mapConverter<K, V>(
    keyConverter: Converter<K, Serializable>,
    valueConverter: Converter<V, Serializable>,
): Converter<ImmutableMap<K, V>, Serializable> {
  return iterableConverter(
      contents => createImmutableMap(new Map([...contents])),
      tupleConverter([keyConverter, valueConverter]),
  );
}
