/**
 * Carries result of RNG.
 */
export interface RandomItem<S, I> {
  readonly item: I;
  readonly state: S;
}
