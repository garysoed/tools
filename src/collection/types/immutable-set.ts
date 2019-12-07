import { cache } from '../operators/cache';
import { distinct } from '../operators/distinct';
import { pipe } from '../pipe';
import { asImmutableList } from './immutable-list';
import { Stream } from './stream';

export interface ImmutableSet<T> extends Stream<T, void>, Iterable<T> {
  isFinite: true;
}

export function createImmutableSet<T>(iterable: Iterable<T> = []): ImmutableSet<T> {
  const generator: Stream<T, void> = pipe(
      function *(): IterableIterator<T> {
        yield* iterable;
      },
      distinct<T, void>(),
      cache(),
  );

  return Object.assign(
      generator,
      {
        [Symbol.iterator](): IterableIterator<T> {
          return generator();
        },
        isFinite: true as true,
      });
}

export function asImmutableSet<T>(): (from: Stream<T, any>) => ImmutableSet<T> {
  return from => createImmutableSet(pipe(from, asImmutableList<T>())());
}
