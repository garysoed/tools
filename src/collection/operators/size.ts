import { pipe } from '../pipe';
import { countable } from '../generators';
import { Stream } from '../types/stream';
import { pick } from './pick';
import { skip } from './skip';
import { tail } from './tail';
import { zip } from './zip';

export function size<T, K>(): (from: Stream<T, K>) => number {
  return from => pipe(
      from,
      zip(pipe(countable(), skip(1))),
      pick(1),
      tail(),
  ) || 0;
}
