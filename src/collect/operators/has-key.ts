import { pipe } from '../pipe';
import { Stream } from '../types/stream';

import { getKey } from './get-key';
import { head } from './head';

export function hasKey<K>(...keys: K[]): (from: Stream<unknown, K>) => boolean {
  return from => pipe(from, getKey(...keys), head()) !== undefined;
}
