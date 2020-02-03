import { RandomSeed } from '../seed/random-seed';

export function fakeSeed([value, ...rest]: number[]): RandomSeed {
  return {
    next(): [number, RandomSeed] {
      if (rest.length <= 0) {
        return [value, fakeSeed([value])];
      }

      return [value, fakeSeed(rest)];
    },
  };
}
