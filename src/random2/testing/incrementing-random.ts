import {numberType} from 'gs-types';

import {newRandom, Random} from '../random';

export function incrementingRandom(count: number): Random<number> {
  return newRandom(
      seed => {
        numberType.assert(seed);
        return [seed, ((seed * count + 1) % count) / count];
      },
      seed => seed,
  );
}