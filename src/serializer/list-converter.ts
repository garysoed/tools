import { Converter, Serializable } from '@nabu';

import { iterableConverter } from './iterable-converter';


export function listConverter<T>(itemConverter: Converter<T, Serializable>):
    Converter<T[], Serializable> {
  return iterableConverter(
      content => [...content],
      itemConverter,
  );
}
