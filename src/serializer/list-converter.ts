import { Converter, Serializable } from '@nabu';
import { createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { iterableConverter } from './iterable-converter';

export function listConverter<T>(itemConverter: Converter<T, Serializable>):
    Converter<ImmutableList<T>, Serializable> {
  return iterableConverter(
      content => createImmutableList([...content]),
      itemConverter,
  );
}
