import {RandomSeed} from './seed/random-seed';

/**
 * Generates random values.
 *
 * @thModule random
 */
export class Random {
  constructor(
      private readonly seed: RandomSeed,
  ) { }

  next(): number {
    return this.seed.next();
  }
}

export function fromSeed(seed: RandomSeed): Random {
  return new Random(seed);
}
