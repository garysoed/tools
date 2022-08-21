import {RandomSeed} from './random-seed';

export interface RandomGen<T> extends Iterable<T> {
  map<T2>(fn: (from: T) => T2): RandomGen<T2>;
}

class RandomGenImpl<T> implements RandomGen<T> {
  constructor(
      private readonly seed: RandomSeed,
      private readonly mapFn: (value: number) => T,
  ) { }

  [Symbol.iterator](): Iterator<T> {
    const seed = this.seed;
    const mapFn = this.mapFn;
    return {
      next() {
        return {value: mapFn(seed.next())};
      },
    };
  }

  map<T2>(fn: (from: T) => T2): RandomGen<T2> {
    return new RandomGenImpl(
        this.seed.fork(),
        value => fn(this.mapFn(value)),
    );
  }
}

export function randomGen(seed: RandomSeed): RandomGen<number> {
  return new RandomGenImpl(seed, value => value);
}