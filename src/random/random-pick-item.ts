import {asRandom, Random} from './random';
import {shuffle} from './shuffle';

export function randomPickItem<T>(
  values: readonly T[],
  seed: Random<number>,
): Random<T> {
  return shuffle(values, seed).take((shuffled) => {
    const [value] = shuffled;
    if (value !== undefined) {
      return asRandom(value);
    }

    if (shuffled.length === 0) {
      throw new Error('Values array is empty');
    }

    return asRandom(undefined as T);
  });
}
