import {Random} from '../random';

/**
 * Picks an integer in the given interval with the given fractional position.
 *
 * @param from The start interval (inclusive).
 * @param to The end interval (exclusive).
 * @param rng The random object
 * @return Random integer in the given range.
 */
export function randomPickInt(from: number, to: number, rng: Random): number {
  return from + Math.floor(rng.next() * (to - from));
}
