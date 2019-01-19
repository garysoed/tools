import { toArray } from '../generators';
import { TypedGenerator } from './generator';

export interface InfiniteList<T> extends TypedGenerator<T, void> {}

export function createInfiniteList<T>(array: T[] = []): InfiniteList<T> {
  return function *(): IterableIterator<T> {
    yield* array;
  };
}

export function asInfiniteList<T>(): (from: TypedGenerator<T, any>) => InfiniteList<T> {
  return from => createInfiniteList(toArray(from));
}
