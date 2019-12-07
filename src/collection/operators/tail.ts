import { pipe } from '../pipe';
import { Stream } from '../types/stream';
import { head } from './head';
import { reverse } from './reverse';

export function tail<T, K>(): (from: Stream<T, K>) => T|undefined {
  return from => pipe(from, reverse(), head());
}
