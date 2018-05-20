/**
 * A Random Number Generator.
 */
export interface Rng {
  /**
   * Generates a random number in [0..1).
   *
   * @return A random number.
   */
  next(): number;
}
