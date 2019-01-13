import { Converter, Serializable } from 'nabu/export/main';
import { ImmutableList } from '../collect/immutable-list';
import { iterableConverter } from './iterable-converter';

export function listConverter<T>(itemConverter: Converter<T, Serializable>):
    Converter<ImmutableList<T>, Serializable> {
  return iterableConverter(
      content => ImmutableList.of([...content]),
      itemConverter,
  );
}
