import { pipe } from '../pipe';
import { Stream } from '../types/stream';
import { filter } from './filter';
import { head } from './head';

export function hasEntry<T, K = void>(...entries: T[]): (from: Stream<T, K>) => boolean {
  const entrySet = new Set(entries);

  return from => pipe(from, filter(item => entrySet.has(item)), head()) !== undefined;
}
