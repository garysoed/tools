import { transform } from '../transform';
import { TypedGenerator } from '../types/generator';
import { head } from './head';
import { reverse } from './reverse';

export function tail<T, K>(): (from: TypedGenerator<T, K>) => T|undefined {
  return from => transform(from, reverse(), head());
}
