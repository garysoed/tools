import { RandomGenerator, RandomResult } from '../random-generator';

/**
 * Picks an integer from the given interval.
 *
 * @param from The start interval (inclusive).
 * @param to The end interval (exclusive).
 * @return Integer picked randomly in the given interval.
 */
export function randomInt(from: number, to: number, rng: RandomGenerator): RandomResult<number> {
  const [value, nextRng] = rng.next();
  return [from + Math.floor(value * (to - from)), nextRng];
}
