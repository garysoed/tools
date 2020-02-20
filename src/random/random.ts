import { RandomSeed } from './seed/random-seed';

type Getter<R, A, B> = (values: {random: R; rng: Random<undefined>; value: A}) => Random<B>;

export class Random<T> {
  constructor(
      readonly value: T,
      private readonly seed: RandomSeed,
  ) { }

  get<T2>(getter: (arg: {rng: Random<undefined>; value: T}) => Random<T2>): Random<T2> {
    return getter({value: this.value, rng: fromSeed(this.seed)});
  }

  map<T2>(fn: (value: T) => T2): Random<T2> {
    return new Random(fn(this.value), this.seed);
  }

  next<T2>(getter: Getter<number, T, T2>): Random<T2>;
  next<T2>(count: number, getter: Getter<readonly number[], T, T2>): Random<T2>;
  next(
      countOrGetter: number|Getter<number, T, unknown>,
      getter?: Getter<readonly number[], T, unknown>,
  ): Random<unknown> {
    if (typeof countOrGetter === 'function') {
      const [random, nextSeed] = this.seed.next();
      return countOrGetter({random, value: this.value, rng: fromSeed(nextSeed)});
    }

    if (!getter) {
      throw new Error('Unsupported');
    }

    const randoms: number[] = [];
    let nextSeed = this.seed;
    for (let i = 0; i < countOrGetter; i++) {
      const result = nextSeed.next();
      randoms.push(result[0]);
      nextSeed = result[1];
    }

    return getter({random: randoms, value: this.value, rng: fromSeed(nextSeed)});
  }
}

export function fromSeed(seed: RandomSeed): Random<undefined> {
  return new Random(undefined, seed);
}
