import { exec } from '../exec';
import { Stream } from '../types/stream';
import { head } from './head';
import { reverse } from './reverse';

export function tail<T, K>(): (from: Stream<T, K>) => T|undefined {
  return from => exec(from, reverse(), head());
}
