import {asRandom, Random} from './random';
import {shuffle} from './shuffle';

export function randomPickItem<T>(
  values: readonly T[],
  seed: Random<number>,
): Random<T | undefined> {
  return shuffle(values, seed).take((shuffled) =>
    asRandom(shuffled[0] ?? undefined),
  );
}
