import { HasPropertiesType, InstanceofType, IntersectType, NumberType, Type } from 'gs-types/export';
import { toArray } from '../generators';
import { Stream } from './stream';

export interface ImmutableList<T> extends Stream<T, void>, Iterable<T> {
  isFinite: true;
}

interface ItemList<T> {
  length: number;
  item(index: number): T;
}

function ItemListType<T>(): Type<ItemList<T>> {
  return IntersectType<ItemList<T>>([
    HasPropertiesType({item: InstanceofType(Function)}),
    HasPropertiesType({length: NumberType}),
  ]);
}

export function createImmutableList<T>(data: T[]|ItemList<T> = []): ImmutableList<T> {
  const generator = function *(): IterableIterator<T> {
    yield* convertToArray(data);
  };

  return Object.assign(
      generator,
      {
        [Symbol.iterator](): IterableIterator<T> {
          return generator();
        },
        isFinite: true as true,
      },
  );
}

function convertToArray<T>(data: T[]|ItemList<T>): T[] {
  if (data instanceof Array) {
    return data;
  }

  const array: any[] = [];
  for (let i = 0; i < data.length; i++) {
    array.push(data.item(i));
  }

  return array;
}

export function asImmutableList<T>(): (from: Stream<T, any>) => ImmutableList<T> {
  return from => createImmutableList(toArray(from));
}
