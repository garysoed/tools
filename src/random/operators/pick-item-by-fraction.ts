import {Random} from '../random';

import {pickIntByFraction} from './pick-int-by-fraction';


/**
 * Picks an item randomly from the given list.
 *
 * @param values The list to pick the value from.
 * @param rng The random object.
 * @return A random item from the given array.
 */
export function pickItemByFraction<T>(values: readonly T[], rng: Random): T|undefined {
  const index = pickIntByFraction(0, values.length, rng);
  return values[index] ?? undefined;
}
