import { EqualType, HasPropertiesType, InstanceofType, Type } from '@gs-types';

import { generatorFrom } from '../generators';
import { eager } from '../operators/eager-finite';
import { pipe } from '../pipe';

import { Stream } from './stream';

export interface ImmutableMap<K, V> extends Stream<[K, V], K>, Iterable<[K, V]> {
  isFinite: true;
  getKey(entry: [K, V]): K;
}

export function ImmutableMapType<K, V>(): Type<ImmutableMap<K, V>> {
  return HasPropertiesType<ImmutableMap<K, V>>({
    getKey: InstanceofType<(entry: [K, V]) => K>(Function),
    isFinite: EqualType<true>(true),
  });
}

export function asImmutableMap<K, V>(): (from: Stream<[K, V], K>) => ImmutableMap<K, V> {
  return from => createImmutableMap_(from);
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

function createImmutableMap_<K, V>(generator: () => IterableIterator<[K, V]>): ImmutableMap<K, V> {
  const cached = pipe(generator, eager());

  return Object.assign(
      cached,
      {
        [Symbol.iterator](): IterableIterator<[K, V]> {
          return cached();
        },
        isFinite: true as true,
        getKey([key]: [K, V]): K {
          return key;
        },
      },
  );
}
