/**
 * Carries result of RNG.
 */
export interface RngResult<S, V> {
  readonly state: S;
  readonly value: V;
}
