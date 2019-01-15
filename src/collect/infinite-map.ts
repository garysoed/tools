import { BaseCollection } from './base-collection';
import { TypedGenerator } from './types/generator';

export class InfiniteMap<K, V> extends BaseCollection<[K, V], K, TypedGenerator<[K, V], K>> { }
