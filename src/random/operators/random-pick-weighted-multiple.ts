import { OrderedMap } from '../../collect/structures/ordered-map';
import { Random } from '../random';

import { randomPickWeighted } from './random-pick-weighted';

export function randomPickWeightedMultiple<T>(
    items: ReadonlyArray<readonly [T, number]>,
    count: number,
    rng: Random<unknown>,
): Random<readonly T[]> {
  const pickedItems: T[] = [];
  const orderedMap = new OrderedMap([...items]);
  let nextRng = rng;
  for (let i = 0; i < count; i++) {
    const randomPick = randomPickWeighted([...orderedMap], nextRng);
    const result = randomPick.value;
    if (result === null) {
      return nextRng.map(() => pickedItems);
    }

    nextRng = randomPick;
    pickedItems.push(result);
    orderedMap.delete(result);
  }

  return nextRng.map(() => pickedItems);
}
