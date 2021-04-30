import {$pipe} from '../../collect/operators/pipe';
import {take} from '../../collect/operators/take';
import {Random} from '../random';

/**
 * Picks an integer from the given interval.
 *
 * @param from The start interval (inclusive).
 * @param to The end interval (exclusive).
 * @return Integer picked randomly in the given interval.
 */
export function randomInt(from: number, to: number, rng: Random): number {
  return from + Math.floor($pipe(rng, take(1))[0] * (to - from));
}
