import { AnyType, IterableOfType } from 'gs-types/export';
import { generatorFrom } from '../generators';
import { eager } from '../operators/eager-finite';
import { pipe } from '../pipe';
import { Stream } from './stream';

export interface ImmutableList<T> extends Stream<T, void>, Iterable<T> {
  isFinite: true;
}

interface ItemList<T> {
  length: number;
  item(index: number): T;
}

function createImmutableList_<T>(generator: () => IterableIterator<T>): ImmutableList<T> {
  const cached = pipe(generator, eager());

  return Object.assign(
      cached,
      {
        [Symbol.iterator](): IterableIterator<T> {
          return cached();
        },
        isFinite: true as true,
      },
  );
}

export function createImmutableList<T>(data: Iterable<T>|ItemList<T> = []): ImmutableList<T> {
  return createImmutableList_(generatorFrom(convertToIterable(data)));
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
