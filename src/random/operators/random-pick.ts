import { RandomGenerator } from '../random-generator';

import { randomPickWeighted } from './random-pick-weighted';

export function randomPick<T>(
    items: readonly T[],
    randomGenerator: RandomGenerator,
): readonly [T|null, RandomGenerator] {
  return randomPickWeighted(items.map(item => [item, 1] as [T, number]), randomGenerator);
}
