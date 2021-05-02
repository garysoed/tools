import {RandomGen} from './gen/random-gen';

/**
 * Generates random values.
 *
 * @thModule random
 */
export class Random {
  constructor(
      private seed: RandomGen,
  ) { }

  next(): number {
    const [seed, value] = this.seed.next();
    this.seed = seed;
    return value;
  }
}

export function fromSeed(seed: RandomGen): Random {
  return new Random(seed);
}
