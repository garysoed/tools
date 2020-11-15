import {RandomSeed} from './random-seed';


export function mathSeed(): RandomSeed {
  return {
    next(): number {
      return Math.random();
    },
  };
}
