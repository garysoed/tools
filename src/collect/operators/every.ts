import { toArray } from '../generators';
import { Stream } from '../types/stream';

export function every<T, K>(
    checkFn: (item: T) => boolean,
): (from: Stream<T, K>) => boolean {
  return (from: Stream<T, K>) => {
    for (const value of toArray(from)) {
      if (!checkFn(value)) {
        return false;
      }
    }

    return true;
  };
}
