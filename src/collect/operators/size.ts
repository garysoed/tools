import { exec } from '../exec';
import { countable } from '../generators';
import { Stream } from '../types/stream';
import { pick } from './pick';
import { skip } from './skip';
import { tail } from './tail';
import { zip } from './zip';

export function size<T, K>(): (from: Stream<T, K>) => number {
  return from => exec(
      from,
      zip(exec(countable(), skip(1))),
      pick(1),
      tail(),
  ) || 0;
}
