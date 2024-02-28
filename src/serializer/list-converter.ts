import {Converter} from 'nabu';

import {iterableConverter} from './iterable-converter';

export function listConverter<T>(
  itemConverter: Converter<T, unknown>,
): Converter<readonly T[], unknown> {
  return iterableConverter((content) => [...content], itemConverter);
}
