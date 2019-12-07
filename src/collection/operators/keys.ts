import { createGeneratorOperatorCopySize } from '../create-operator';
import { getKey } from '../generators';
import { pipe } from '../pipe';
import { Stream } from '../types/stream';
import { map } from './map';

export function keys<T, K>(): (from: Stream<T, K>) => Stream<K, void> {
  return createGeneratorOperatorCopySize(from => pipe(from, map(entry => getKey(from, entry))));
}
