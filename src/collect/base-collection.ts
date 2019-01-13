import { transform } from './transform';
import { TypedGenerator } from './typed-generator';

type Operator<F, T> = (from: F) => T;

export abstract class BaseCollection<T, I extends TypedGenerator<T>> implements Iterable<T> {
  constructor(readonly generator: I) { }

  [Symbol.iterator](): Iterator<T> {
    return this.generator();
  }

  $<D>(
      t0: Operator<I, D>,
  ): D;
  $<S0, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, D>,
  ): D;
  $<S0, S1, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, D>,
  ): D;
  $<S0, S1, S2, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, S2>,
      t3: Operator<S2, D>,
  ): D;
  $<S0, S1, S2, S3, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, S2>,
      t3: Operator<S2, S3>,
      t4: Operator<S2, D>,
  ): D;
  $(
      ...transformers: Array<Operator<any, any>>): any {
    return transform(this.generator, ...transformers);
  }
}
