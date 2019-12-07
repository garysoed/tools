import { Converter, Serializable } from '@nabu';
import { createImmutableSet, ImmutableSet } from '../collection/types/immutable-set';
import { iterableConverter } from './iterable-converter';

export function setConverter<T>(
    itemConverter: Converter<T, Serializable>,
): Converter<ImmutableSet<T>, Serializable> {
  return iterableConverter(
      contents => createImmutableSet([...contents]),
      itemConverter,
  );
}
