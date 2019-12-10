import { RandomGenerator, RandomResult } from './random-generator';

export function mathRng(): RandomGenerator {
  return {
    next(): RandomResult<number> {
      return [Math.random(), mathRng()];
    },
  };
}
