import { exec } from '../exec';
import { TypedGenerator } from '../types/generator';
import { getKey } from './get-key';
import { head } from './head';

export function hasKey<K>(...keys: K[]): (from: TypedGenerator<unknown, K>) => boolean {
  return from => exec(from, getKey(...keys), head()) !== undefined;
}
