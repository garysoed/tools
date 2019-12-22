export type RandomResult<T> = readonly [T, RandomGenerator];

export interface RandomGenerator {
  next(): RandomResult<number>;
}


interface RandomSeed {
  next(): readonly [number, RandomSeed];
}

interface Random<T> {
  pipe<R>(fn: (nextFn: () => [T, RandomSeed]) => R): Random<R>;
}
