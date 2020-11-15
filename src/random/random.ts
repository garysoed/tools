import {RandomSeed} from './seed/random-seed';

/**
 * Generates random values.
 *
 * @typeParam T - Type of generated values.
 * @thModule random
 */
export class Random {
  constructor(
      private readonly seed: RandomSeed,
  ) { }

  iterable(): Iterable<number> {
    return (function*(random: Random): Generator<number> {
      while (true) {
        yield random.next();
      }
    })(this);
  }

  next(): number {
    return this.seed.next();
  }
}

export function fromSeed(seed: RandomSeed): Random {
  return new Random(seed);
}
