import { Finite } from '../interfaces/finite';

export class Generators {
  static *ranged(
      from: number,
      step: number,
      to: number): IterableIterator<number> {
    if (from > to) {
      throw new Error(`${from} must be <= ${to}`);
    }
    for (let i = from; i < to; i += step) {
      yield i;
    }
  }
}
