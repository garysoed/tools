import {$pipe} from '../../collect/operators/pipe';
import {$take} from '../../collect/operators/take';
import {Random} from '../random';

export function randomPickWeighted<T>(
    items: ReadonlyArray<readonly [T, number]>,
    rng: Random,
): T|null {
  const totalWeight = items.reduce<number>(
      (totalWeight, [, weight]) => totalWeight + weight,
      0,
  );

  let currentTotal = totalWeight * $pipe(rng, $take(1))[0];
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
