import { exec } from '../exec';
import { TypedGenerator } from '../types/generator';
import { head } from './head';
import { reverse } from './reverse';

export function tail<T, K>(): (from: TypedGenerator<T, K>) => T|undefined {
  return from => exec(from, reverse(), head());
}
