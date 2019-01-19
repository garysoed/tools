import { generatorFrom } from '../generators';
import { TypedGenerator } from './generator';

export interface ImmutableMap<K, V> extends TypedGenerator<[K, V], K>, Iterable<[K, V]> {
  isFinite: true;
  getKey([key]: [K, V]): K;
}

function createImmutableMap_<K, V>(generator: () => IterableIterator<[K, V]>): ImmutableMap<K, V> {
  return Object.assign(
    generator,
    {
      [Symbol.iterator](): IterableIterator<[K, V]> {
        return generator();
      },
      isFinite: true as true,
      getKey([key]: [K, V]): K {
        return key;
      },
    },
  );
}

export function createImmutableMap<T>(obj: {[key: string]: T}): ImmutableMap<string, T>;
export function createImmutableMap<K, V>(map?: Map<K, V>|Array<[K, V]>): ImmutableMap<K, V>;
export function createImmutableMap<V>(
    source: Map<any, V>|Array<[any, V]>|{[key: string]: V} = new Map(),
): ImmutableMap<any, V> {
  if (source instanceof Map || source instanceof Array) {
    return createImmutableMap_(generatorFrom(source));
  } else {
    const entries: Array<[string, V]> = [];
    for (const key in source) {
      if (!source.hasOwnProperty(key)) {
        continue;
      }
      entries.push([key, source[key]]);
    }

    return createImmutableMap_(generatorFrom(new Map(entries)));
  }
}

export function asImmutableMap<K, V>(): (from: TypedGenerator<[K, V], K>) => ImmutableMap<K, V> {
  return from => createImmutableMap([...from()]);
}
