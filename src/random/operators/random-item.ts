import { RandomGenerator, RandomResult } from '../random-generator';

import { randomInt } from './random-int';

/**
 * Picks an item randomly from the given list.
 *
 * @param values The list to pick the value from.
 * @return A value from the given list.
 */
export function randomItem<T>(values: T[], rng: RandomGenerator): RandomResult<T> {
  const [value, nextRng] = randomInt(0, values.length, rng);
  return [values[value], nextRng];
}
