import { OrderedMap } from '../../collect/structures/ordered-map';
import { RandomGenerator, RandomResult } from '../random-generator';

import { randomPickWeighted } from './random-pick-weighted';

export function randomPickWeightedMultiple<T>(
    items: ReadonlyArray<readonly [T, number]>,
    count: number,
    randomGenerator: RandomGenerator,
): RandomResult<readonly T[]> {
  const pickedItems: T[] = [];
  const orderedMap = new OrderedMap([...items]);
  let generator = randomGenerator;
  for (let i = 0; i < count; i++) {
    const [result, nextGenerator] = randomPickWeighted([...orderedMap], generator);
    if (result === null) {
      return [pickedItems, nextGenerator];
    }

    generator = nextGenerator;
    pickedItems.push(result);
    orderedMap.delete(result);
  }

  return [pickedItems, generator];
}
