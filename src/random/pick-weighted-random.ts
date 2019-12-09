import { Operator } from '../collect/operator';

import { RngResult } from './rng-result';


export function pickWeightedRandom<T, S>(
    items: ReadonlyArray<readonly [T, number]>,
    rngResult: RngResult<S, number>,
): RngResult<S, T|null> {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  let currentTotal = totalWeight * rngResult.value;
  for (const [entry, weight] of items) {
    currentTotal -= weight;
    if (currentTotal <= 0) {
      return {state: rngResult.state, value: entry};
    }
  }

  return {state: rngResult.state, value: null};
}
