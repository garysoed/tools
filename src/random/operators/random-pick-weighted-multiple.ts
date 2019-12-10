import { RandomGenerator, RandomResult } from '../random-generator';

export function randomPickWeightedMultiple<T>(
    items: ReadonlyArray<readonly [T, number]>,
    count: number,
    randomGenerator: RandomGenerator,
): RandomResult<readonly T[]> {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  const [choice, nextRng] = randomGenerator.next();

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
