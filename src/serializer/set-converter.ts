import { Converter, Serializable } from '@nabu';

import { iterableConverter } from './iterable-converter';

export function setConverter<T>(
    itemConverter: Converter<T, Serializable>,
): Converter<ReadonlySet<T>, Serializable> {
  return iterableConverter(
      contents => new Set([...contents]),
      itemConverter,
  );
}
