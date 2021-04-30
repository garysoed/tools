import {Random} from '../random';

import {randomPickInt} from './random-pick-int';


/**
 * Picks an item randomly from the given list.
 *
 * @param values The list to pick the value from.
 * @param rng The random object.
 * @return A random item from the given array.
 */
export function randomPickItem<T>(values: readonly T[], rng: Random): T|undefined {
  const index = randomPickInt(0, values.length, rng);
  return values[index] ?? undefined;
}
