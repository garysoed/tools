import { RandomSeed } from './random-seed';


export function mathSeed(): RandomSeed {
  return {
    next(): [number, RandomSeed] {
      return [Math.random(), mathSeed()];
    },
  };
}
