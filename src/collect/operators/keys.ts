import { createGeneratorOperatorCopySize } from '../create-operator';
import { exec } from '../exec';
import { getKey } from '../generators';
import { Stream } from '../types/stream';
import { map } from './map';

export function keys<T, K>(): (from: Stream<T, K>) => Stream<K, void> {
  return createGeneratorOperatorCopySize(from => exec(from, map(entry => getKey(from, entry))));
}
