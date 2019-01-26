import { exec } from '../exec';
import { Stream } from '../types/stream';
import { getKey } from './get-key';
import { head } from './head';

export function hasKey<K>(...keys: K[]): (from: Stream<unknown, K>) => boolean {
  return from => exec(from, getKey(...keys), head()) !== undefined;
}
