import { RandomSeed } from '../seed/random-seed';

export class FakeSeed implements RandomSeed {
  constructor(readonly values: number[] = []) {}

  next(): readonly [number, RandomSeed] {
    const [value, ...rest] = this.values;
    return [value, new FakeSeed(rest.length <= 0 ? [value] : rest)];
  }
}
