import {Random} from '../random';

import {randomInt} from './random-int';


/**
 * Picks an item randomly from the given list.
 *
 * @param values The list to pick the value from.
 * @return A value from the given list.
 */
export function randomItem<T>(values: readonly T[], rng: Random): T {
  const index = randomInt(0, values.length, rng);
  return values[index];
}
