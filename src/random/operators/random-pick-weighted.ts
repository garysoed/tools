import { Random } from '../random';

export function randomPickWeighted<T>(
    items: ReadonlyArray<readonly [T, number]>,
    rng: Random<unknown>,
): Random<T|null> {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  return rng.next(({random, rng}) => {
    let currentTotal = totalWeight * random;
    for (const [entry, weight] of items) {
      if (weight <= 0) {
        continue;
      }

      currentTotal -= weight;
      if (currentTotal <= 0) {
        return rng.map(() => entry);
      }
    }

    return rng.map(() => null);
  });
}
