import { toArray } from '../generators';
import { Stream } from '../types/stream';

export function size<T, K>(): (from: Stream<T, K>) => number {
  return (from: Stream<T, K>) => {
    let i = 0;
    for (const _ of toArray(from)) {
      i++;
    }

    return i;
  };
}
