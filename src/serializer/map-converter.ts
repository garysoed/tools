import { Converter, Serializable } from '@nabu';

import { iterableConverter } from './iterable-converter';
import { tupleConverter } from './tuple-converter';

export function mapConverter<K, V>(
    keyConverter: Converter<K, Serializable>,
    valueConverter: Converter<V, Serializable>,
): Converter<ReadonlyMap<K, V>, Serializable> {
  return iterableConverter(
      contents => new Map([...contents]),
      tupleConverter([keyConverter, valueConverter]),
  );
}
