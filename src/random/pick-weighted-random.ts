import { RandomItem } from './random-item';

export function pickWeightedRandom<T, S>(
    items: ReadonlyArray<readonly [T, number]>,
    randomItem: RandomItem<S, number>,
): RandomItem<S, T|null> {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  let currentTotal = totalWeight * randomItem.item;
  for (const [entry, weight] of items) {
    if (weight <= 0) {
      continue;
    }

    currentTotal -= weight;
    if (currentTotal <= 0) {
      return {state: randomItem.state, item: entry};
    }
  }

  return {state: randomItem.state, item: null};
}
