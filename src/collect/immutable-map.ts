import { BaseCollection } from './base-collection';
import { generatorFrom } from './generators';
import { TypedGenerator } from './types/generator';

export class ImmutableMap<K, V> extends BaseCollection<[K, V], K, TypedGenerator<[K, V], K>> {
  static create<K, V>(): (from: TypedGenerator<[K, V], K>) => ImmutableMap<K, V> {
    return from => new ImmutableMap(from);
  }

  static of<K, V>(): ImmutableMap<K, V>;
  static of<T>(obj: {[key: string]: T}): ImmutableMap<string, T>;
  static of<K, V>(map: Map<K, V>): ImmutableMap<K, V>;
  static of<V>(source: Map<any, V>|{[key: string]: V} = new Map()): ImmutableMap<any, V> {
    if (source instanceof Map) {
      return new ImmutableMap(generatorFrom(source));
    } else {
      const entries: Array<[string, V]> = [];
      for (const key in source) {
        if (!source.hasOwnProperty(key)) {
          continue;
        }
        entries.push([key, source[key]]);
      }

      return new ImmutableMap(generatorFrom(new Map(entries)));
    }
  }
}
