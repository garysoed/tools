const __apply = Symbol('apply');
const __fork = Symbol('fork');

type Seed = unknown

export interface Random<T> {
  [__apply](seed: Seed): readonly [T, Seed];
  [__fork](seed: Seed): Seed;
  take<U>(fn: (value: T) => Random<U>): Random<U>;
  takeValues<U>(fn: (value: Iterable<T>) => Random<U>): Random<U>;
  run(seed: Seed): T;
}

class RandomImpl<T> implements Random<T> {
  constructor(
    private readonly applyFn: (seed: Seed) => readonly [T, Seed],
    private readonly forkFn: (seed: Seed) => Seed,
  ) {}

  [__apply](seed: Seed): readonly [T, Seed] {
    return this.applyFn(seed);
  }

  [__fork](seed: Seed): Seed {
    return this.forkFn(seed);
  }

  take<U>(fn: (value: T) => Random<U>): Random<U> {
    return new RandomImpl(
        seed => {
          const [newValue, newSeed] = this[__apply](seed);
          const newRandom = fn(newValue);
          return newRandom[__apply](newSeed);
        },
        seed => this[__fork](seed),
    );
  }

  takeValues<U>(fn: (values: Iterable<T>) => Random<U>): Random<U> {
    return new RandomImpl(
        seed => {
          const applyFn = this[__apply].bind(this);
          const forkFn = this[__fork].bind(this);
          let currSeed = forkFn(seed);
          const iterable = (function*() {
            while (true) {
              const [nextValue, nextSeed] = applyFn(currSeed);
              currSeed = nextSeed;
              yield nextValue;
            }
          })();

          const newRandom = fn(iterable);
          return newRandom[__apply](this[__apply](seed)[1]);
        },
        seed => this[__fork](seed),
    );
  }

  run(seed: Seed): T {
    return this[__apply](seed)[0];
  }
}

export function asRandom<T>(value: T): Random<T> {
  return new RandomImpl(seed => [value, seed], seed => seed);
}

export function newRandom<T>(
    applyFn: (seed: Seed) => [T, Seed],
    forkFn: (seed: Seed) => Seed,
): Random<T> {
  return new RandomImpl(applyFn, forkFn);
}
