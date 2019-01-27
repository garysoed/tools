import { AnyType, HasPropertiesType, InstanceofType, IntersectType, IterableOfType, NumberType, Type } from 'gs-types/export';
import { Stream } from './stream';

export interface ImmutableList<T> extends Stream<T, void>, Iterable<T> {
  isFinite: true;
}

interface ItemList<T> {
  length: number;
  item(index: number): T;
}

function createImmutableList_<T>(generator: () => IterableIterator<T>): ImmutableList<T> {
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

export function createImmutableList<T>(data: Iterable<T>|ItemList<T> = []): ImmutableList<T> {
  const generator = function *(): IterableIterator<T> {
    yield* convertToIterable(data);
  };

  return createImmutableList_(generator);
}

function convertToIterable<T>(data: Iterable<T>|ItemList<T>): Iterable<T> {
  if (IterableOfType(AnyType<T>()).check(data)) {
    return data;
  }

  const array: any[] = [];
  for (let i = 0; i < data.length; i++) {
    array.push(data.item(i));
  }

  return array;
}

export function asImmutableList<T>(): (from: Stream<T, any>) => ImmutableList<T> {
  return from => {
    if (!from.isFinite) {
      throw new Error('generator requires to be finite');
    }

    return createImmutableList_(from);
  };
}
