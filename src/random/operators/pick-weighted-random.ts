import { RandomGenerator, RandomResult } from '../random-generator';

export function pickWeightedRandom<T>(
    items: ReadonlyArray<readonly [T, number]>,
    randomItem: RandomGenerator,
): RandomResult<T|null> {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  const [choice, nextRng] = randomItem.next();

  let currentTotal = totalWeight * choice;
  for (const [entry, weight] of items) {
    if (weight <= 0) {
      continue;
    }

    currentTotal -= weight;
    if (currentTotal <= 0) {
      return [entry, nextRng];
    }
  }

  return [null, nextRng];
}
