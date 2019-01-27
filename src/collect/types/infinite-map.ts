import { generatorFrom } from '../generators';
import { Stream } from './stream';

export interface InfiniteMap<K, V> extends Stream<[K, V], K>, Iterable<[K, V]> {
  getKey([key]: [K, V]): K;
}

function createInfiniteMap_<K, V>(iterable: Iterable<[K, V]>): InfiniteMap<K, V> {
  const generator = function *(): IterableIterator<[K, V]> {
    yield* iterable;
  };

  return Object.assign(
    generator,
    {
      [Symbol.iterator](): IterableIterator<[K, V]> {
        return generator();
      },
      getKey([key]: [K, V]): K {
        return key;
      },
    },
  );
}

export function createInfiniteMap<T>(obj: {[key: string]: T}): InfiniteMap<string, T>;
export function createInfiniteMap<K, V>(map?: Map<K, V>|Array<[K, V]>): InfiniteMap<K, V>;
export function createInfiniteMap<V>(
    source: Map<any, V>|Array<[any, V]>|{[key: string]: V} = new Map(),
): InfiniteMap<any, V> {
  if (source instanceof Map || source instanceof Array) {
    return createInfiniteMap_(source);
  } else {
    const entries: Array<[string, V]> = [];
    for (const key in source) {
      if (!source.hasOwnProperty(key)) {
        continue;
      }
      entries.push([key, source[key]]);
    }

    return createInfiniteMap_(new Map(entries));
  }
}

export function asInfiniteMap<K, V>(): (from: Stream<[K, V], K>) => InfiniteMap<K, V> {
  return from => createInfiniteMap_(from());
}
