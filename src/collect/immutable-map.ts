import { BaseCollection } from './base-collection';
import { generatorFrom } from './generators';
import { TypedGenerator } from './types/generator';

export class ImmutableMap<K, V> extends BaseCollection<[K, V], K, TypedGenerator<[K, V], K>> {
  static create<K, V>(): (from: TypedGenerator<[K, V], K>) => ImmutableMap<K, V> {
    return from => new ImmutableMap(from);
  }

  static of<K, V>(map: Map<K, V> = new Map()): ImmutableMap<K, V> {
    return new ImmutableMap(generatorFrom(map));
  }
}
