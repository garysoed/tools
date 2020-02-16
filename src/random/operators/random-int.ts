import { Random } from '../random';

/**
 * Picks an integer from the given interval.
 *
 * @param from The start interval (inclusive).
 * @param to The end interval (exclusive).
 * @return Integer picked randomly in the given interval.
 */
export function randomInt(from: number, to: number, rng: Random<unknown>): Random<number> {
  return rng.next(({random, rng}) => {
    return rng.map(() => from + Math.floor(random * (to - from)));
  });
}
