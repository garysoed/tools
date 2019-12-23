import { RandomSeed } from './seed/random-seed';

export type RandomResult<T> = readonly [T, RandomGenerator];

export interface RandomGenerator {
  next(): RandomResult<number>;
}

interface Random<T> {
  pipe<R>(fn: (nextFn: () => [T, RandomSeed]) => R): Random<R>;
}
