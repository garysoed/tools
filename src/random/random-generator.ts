import { RandomSeed } from './seed/random-seed';

export type RandomResult<T> = readonly [T, RandomGenerator];

export class RandomGenerator {
  constructor(private readonly seed: RandomSeed) { }

  next(): RandomResult<number>;
  next(count: number): RandomResult<number[]>;
  next(count?: number): RandomResult<number[]|number> {
    if (count === undefined) {
      const [result, nextSeed] = this.seed.next();
      return [result, new RandomGenerator(nextSeed)];
    }

    const values: number[] = [];
    let nextSeed = this.seed;
    for (let i = 0; i < count; i++) {
      const result = nextSeed.next();
      values.push(result[0]);
      nextSeed = result[1];
    }

    return [values, new RandomGenerator(nextSeed)];
  }
}
