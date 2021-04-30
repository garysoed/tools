import {RandomSeed} from './seed/random-seed';

/**
 * Generates random values.
 *
 * @typeParam T - Type of generated values.
 * @thModule random
 */
export class Random implements Iterable<number> {
  constructor(
      private readonly seed: RandomSeed,
  ) { }

  *[Symbol.iterator](): Iterator<number, unknown, undefined> {
    while (true) {
      yield this.seed.next();
    }
  }
}

export function fromSeed(seed: RandomSeed): Random {
  return new Random(seed);
}
