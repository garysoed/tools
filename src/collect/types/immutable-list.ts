import { toArray } from '../generators';
import { TypedGenerator } from './generator';

export interface ImmutableList<T> extends TypedGenerator<T, void>, Iterable<T> {
  isFinite: true;
}

export function createImmutableList<T>(array: T[] = []): ImmutableList<T> {
  const generator = function *(): IterableIterator<T> {
    yield* array;
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

export function asImmutableList<T>(): (from: TypedGenerator<T, any>) => ImmutableList<T> {
  return from => createImmutableList(toArray(from));
}
