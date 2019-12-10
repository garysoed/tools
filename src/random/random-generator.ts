export type RandomResult<T> = readonly [T, RandomGenerator];

export interface RandomGenerator {
  next(): RandomResult<number>;
}
