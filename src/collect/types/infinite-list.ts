import { toArray } from '../generators';
import { Stream } from './stream';

export interface InfiniteList<T> extends Stream<T, void> {}

export function createInfiniteList<T>(array: T[] = []): InfiniteList<T> {
  return function *(): IterableIterator<T> {
    yield* array;
  };
}

export function asInfiniteList<T>(): (from: Stream<T, any>) => InfiniteList<T> {
  return from => createInfiniteList(toArray(from));
}
