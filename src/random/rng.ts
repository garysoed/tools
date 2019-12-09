import { RngResult } from './rng-result';

export type Rng<S> = Generator<RngResult<S, number>, RngResult<S, number>, undefined>;
