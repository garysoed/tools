import { Stream } from './stream';

export interface InfiniteList<T> extends Stream<T, void> {}

export function createInfiniteList<T>(iterable: Iterable<T> = []): InfiniteList<T> {
  return function *(): IterableIterator<T> {
    yield* iterable;
  };
}

export function asInfiniteList<T>(): (from: Stream<T, any>) => InfiniteList<T> {
  return from => createInfiniteList(from());
}
