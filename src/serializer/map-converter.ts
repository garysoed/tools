import { Converter } from 'nabu';

import { iterableConverter } from './iterable-converter';
import { tupleConverter } from './tuple-converter';

export function mapConverter<K, V>(
    keyConverter: Converter<K, unknown>,
    valueConverter: Converter<V, unknown>,
): Converter<ReadonlyMap<K, V>, unknown> {
  return iterableConverter(
      contents => new Map([...contents]),
      tupleConverter([keyConverter, valueConverter]),
  );
}
