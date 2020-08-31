import { Random } from '../random';

export function randomPickWeighted<T>(
    items: ReadonlyArray<readonly [T, number]>,
    rng: Random,
): T|null {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  let currentTotal = totalWeight * rng.next();
  for (const [entry, weight] of items) {
    if (weight <= 0) {
      continue;
    }

    currentTotal -= weight;
    if (currentTotal <= 0) {
      return entry;
    }
  }

  return null;
}
