import { RandomGenerator, RandomResult } from '../random-generator';

export function fakeRng([value, ...rest]: number[]): RandomGenerator {
  return {
    next(): RandomResult<number> {
      if (rest.length <= 0) {
        return [value, fakeRng([value])];
      }

      return [value, fakeRng(rest)];
    },
  };
}
