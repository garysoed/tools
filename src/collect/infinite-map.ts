import { BaseCollection } from './base-collection';
import { KeyedGenerator } from './operators/keyed-generator';

export class InfiniteMap<K, V> extends BaseCollection<[K, V], KeyedGenerator<K, [K, V]>> {
  constructor(private readonly generator: KeyedGenerator<K, [K, V]>) {
    super();
  }

  iterableFactory(): KeyedGenerator<K, [K, V]> {
    return this.generator;
  }
}
