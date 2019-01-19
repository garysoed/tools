import { exec } from '../exec';
import { TypedGenerator } from '../types/generator';
import { filter } from './filter';
import { head } from './head';

export function hasEntry<T, K = void>(...entries: T[]): (from: TypedGenerator<T, K>) => boolean {
  const entrySet = new Set(entries);

  return from => exec(from, filter(item => entrySet.has(item)), head()) !== undefined;
}
