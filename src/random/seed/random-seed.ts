export interface RandomSeed {
  next(): readonly [number, RandomSeed];
}
