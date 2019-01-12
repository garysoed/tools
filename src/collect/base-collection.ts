import { TypedGenerator } from './operators/typed-generator';
import { transform } from './transform';

type Operator<F, T> = (from: F) => T;

export abstract class BaseCollection<T, I extends TypedGenerator<T>> {
  abstract iterableFactory(): I;

  transform<D>(
      t0: Operator<I, D>,
  ): D;
  transform<S0, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, D>,
  ): D;
  transform<S0, S1, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, D>,
  ): D;
  transform<S0, S1, S2, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, S2>,
      t3: Operator<S2, D>,
  ): D;
  transform<S0, S1, S2, S3, D>(
      t0: Operator<I, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, S2>,
      t3: Operator<S2, S3>,
      t4: Operator<S2, D>,
  ): D;
  transform(
      ...transformers: Array<Operator<any, any>>): any {
    return transform(this.iterableFactory(), ...transformers);
  }
}
