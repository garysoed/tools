export interface RandomSeed {
  /**
   * Creates a new instance of RandomSeed with a randomized starting seed.
   */
  fork(): RandomSeed;
  next(): number;
}
