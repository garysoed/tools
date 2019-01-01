import { Converter, Serializable } from 'nabu/export/main';
import { ImmutableSet } from '../immutable/immutable-set';
import { iterableConverter } from './iterable-converter';

export function setConverter<T>(
    itemConverter: Converter<T, Serializable>,
): Converter<ImmutableSet<T>, Serializable> {
  return iterableConverter(
      contents => ImmutableSet.of(contents),
      itemConverter,
  );
}