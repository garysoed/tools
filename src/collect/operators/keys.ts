import { createGeneratorOperatorCopySize } from '../create-operator';
import { pipe } from '../pipe';
import { getKey } from '../generators';
import { Stream } from '../types/stream';
import { map } from './map';

export function keys<T, K>(): (from: Stream<T, K>) => Stream<K, void> {
  return createGeneratorOperatorCopySize(from => pipe(from, map(entry => getKey(from, entry))));
}
