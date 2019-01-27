import { Stream } from '../types/stream';

/**
 * Converts the Stream to an array.
 */
export function asArray<T>(): (from: Stream<T, any>) => T[] {
  return from => {
    if (from.isFinite !== true) {
      throw new Error('generator requires to be finite');
    }

    return [...from()];
  };
}
