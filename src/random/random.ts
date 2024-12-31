const __apply = Symbol('apply');
const __fork = Symbol('fork');

type Seed = unknown;

export interface Random<T> {
  [__apply](seed: Seed): readonly [T, Seed];
  [__fork](seed: Seed): Seed;
  run(seed: Seed): T;
  take<U>(fn: (value: T) => Random<U>): Random<U>;
  takeValues<U>(
    fn: (value: Generator<T, never, unknown>) => Random<U>,
  ): Random<U>;
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
  run(seed: Seed): T {
    return this[__apply](seed)[0];
  }
  take<U>(fn: (value: T) => Random<U>): Random<U> {
    return new RandomImpl(
      (seed) => {
        const [newValue, newSeed] = this[__apply](seed);
        const newRandom = fn(newValue);
        return newRandom[__apply](newSeed);
      },
      (seed) => this[__fork](seed),
    );
  }
  takeValues<U>(
    fn: (values: Generator<T, never, unknown>) => Random<U>,
  ): Random<U> {
    return new RandomImpl(
      (seed) => {
        const applyFn = this[__apply].bind(this);
        const forkFn = this[__fork].bind(this);
        let currSeed = forkFn(seed);
        const iterable = (function* () {
          while (true) {
            const [nextValue, nextSeed] = applyFn(currSeed);
            currSeed = nextSeed;
            yield nextValue;
          }
        })();

        const newRandom = fn(iterable);
        return newRandom[__apply](this[__apply](seed)[1]);
      },
      (seed) => this[__fork](seed),
    );
  }
}

type TypesOf<A extends readonly any[]> = {
  readonly [K in keyof A]: A[K] extends Random<infer T> ? T : never;
};

export function combineRandom<A extends ReadonlyArray<Random<any>>>(
  ...randoms: A
): Random<TypesOf<A>>;
export function combineRandom(
  ...randoms: ReadonlyArray<Random<unknown>>
): Random<readonly unknown[]> {
  const [random, ...rest] = randoms;
  if (random === undefined) {
    return asRandom([]);
  }
  return random.take((value) => {
    return combineRandom(...rest).take((values) =>
      asRandom([value, ...values]),
    );
  });
}
export function asRandom<T>(value: T): Random<T> {
  return new RandomImpl(
    (seed) => [value, seed],
    (seed) => seed,
  );
}

export function newRandom<T>(
  applyFn: (seed: Seed) => [T, Seed],
  forkFn: (seed: Seed) => Seed,
): Random<T> {
  return new RandomImpl(applyFn, forkFn);
}
