import { RandomItem } from './random-item';

export type Rng<S> = Generator<RandomItem<S, number>, RandomItem<S, number>, undefined>;
