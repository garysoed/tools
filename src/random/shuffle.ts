import {Random} from './random';
import {shuffleWeighted} from './shuffle-weighted';

export function shuffle<T>(
  orig: readonly T[],
  seed: Random<number>,
): Random<readonly T[]> {
  return shuffleWeighted(
    orig.map((value) => [value, 0] as const),
    seed,
  );
}
