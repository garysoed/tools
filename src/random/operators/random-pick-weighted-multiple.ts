import { OrderedMap } from '../../collect/structures/ordered-map';
import { Random } from '../random';

import { randomPickWeighted } from './random-pick-weighted';


export function randomPickWeightedMultiple<T>(
    items: ReadonlyArray<readonly [T, number]>,
    count: number,
    rng: Random,
): readonly T[] {
  const pickedItems: T[] = [];
  const orderedMap = new OrderedMap([...items]);
  for (let i = 0; i < count; i++) {
    const result = randomPickWeighted([...orderedMap], rng);
    if (result === null) {
      return pickedItems;
    }

    pickedItems.push(result);
    orderedMap.delete(result);
  }

  return pickedItems;
}
