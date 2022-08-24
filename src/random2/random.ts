const __apply = Symbol('apply');

type Seed = unknown

export interface Random<T> {
  [__apply](seed: Seed): readonly [T, Seed];
  doBind<U>(fn: (value: T) => Random<U>): Random<U>;
  generate(): Random<Iterable<T>>;
  run(seed: Seed): T;
}

class RandomImpl<T> implements Random<T> {
  constructor(private readonly applyFn: (seed: Seed) => readonly [T, Seed]) {}

  [__apply](seed: Seed): readonly [T, Seed] {
    return this.applyFn(seed);
  }

  doBind<U>(fn: (value: T) => Random<U>): Random<U> {
    return new RandomImpl(seed => {
      const [newValue, newSeed] = this[__apply](seed);
      const newRandom = fn(newValue);
      return newRandom[__apply](newSeed);
    });
  }

  generate(): Random<Iterable<T>> {
    return new RandomImpl(seed => {
      const applyFn = this[__apply].bind(this);
      const iterable = (function*() {
        let currSeed = seed;
        while (true) {
          const [nextValue, nextSeed] = applyFn(currSeed);
          currSeed = nextSeed;
          yield nextValue;
        }
      })();
      return [iterable, seed];
    });
  }

  run(seed: Seed): T {
    return this[__apply](seed)[0];
  }
}

export function asRandom<T>(value: T): Random<T> {
  return new RandomImpl(seed => [value, seed]);
}

export function newRandom<T>(fn: (seed: Seed) => [T, Seed]): Random<T> {
  return new RandomImpl(fn);
}
