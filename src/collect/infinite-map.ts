import { BaseCollection } from './base-collection';
import { KeyedGenerator } from './keyed-generator';

export class InfiniteMap<K, V> extends BaseCollection<[K, V], KeyedGenerator<K, [K, V]>> {
  constructor(generator: KeyedGenerator<K, [K, V]>) {
    super(generator);
  }
}
