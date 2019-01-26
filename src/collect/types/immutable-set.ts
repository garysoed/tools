import { exec } from '../exec';
import { distinct } from '../operators/distinct';
import { asImmutableList } from './immutable-list';
import { Stream } from './stream';

export interface ImmutableSet<T> extends Stream<T, void>, Iterable<T> {
  isFinite: true;
}

export function createImmutableSet<T>(iterable: Iterable<T> = []): ImmutableSet<T> {
  const generator: Stream<T, void> = exec(
      function *(): IterableIterator<T> {
        yield* iterable;
      },
      distinct(),
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
  return from => createImmutableSet(asImmutableList<T>()(from));
}
