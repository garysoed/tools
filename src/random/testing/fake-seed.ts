import {RandomSeed} from '../seed/random-seed';

export class FakeSeed implements RandomSeed {
  private index = 0;

  constructor(public values: number[] = []) {}

  next(): number {
    const value = this.values[this.index];
    this.index = Math.min(this.index + 1, this.values.length - 1);
    return value;
  }
}
