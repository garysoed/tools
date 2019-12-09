import { RandomItem } from './random-item';

export function pickWeightedRandom<T, S>(
    items: ReadonlyArray<readonly [T, number]>,
    rngResult: RandomItem<S, number>,
): RandomItem<S, T|null> {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  let currentTotal = totalWeight * rngResult.item;
  for (const [entry, weight] of items) {
    if (weight <= 0) {
      continue;
    }

    currentTotal -= weight;
    if (currentTotal <= 0) {
      return {state: rngResult.state, item: entry};
    }
  }

  return {state: rngResult.state, item: null};
}
