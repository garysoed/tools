import { transform } from '../transform';
import { TypedGenerator } from '../types/generator';
import { getKey } from './get-key';
import { head } from './head';

export function hasKey<K>(...keys: K[]): (from: TypedGenerator<unknown, K>) => boolean {
  return from => transform(from, getKey(...keys), head()) !== undefined;
}
