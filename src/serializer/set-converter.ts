import { Converter } from 'nabu';

import { iterableConverter } from './iterable-converter';

export function setConverter<T>(
    itemConverter: Converter<T, unknown>,
): Converter<ReadonlySet<T>, unknown> {
  return iterableConverter(
      contents => new Set([...contents]),
      itemConverter,
  );
}
