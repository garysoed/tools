export interface Result<S> {
  readonly state: S;
  readonly value: number;
}

export type Rng<S> = Generator<Result<S>, Result<S>, undefined>;
