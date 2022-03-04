import {RandomGen} from '../gen/random-gen';

export class FakeSeed implements RandomGen {
  constructor(
      public values: number[] = [0],
      private readonly index = 0,
  ) {}

  next(): [FakeSeed, number] {
    const value = this.values[this.index];
    return [
      new FakeSeed(this.values, Math.min(this.index + 1, this.values.length - 1)),
      value,
    ];
  }
}
