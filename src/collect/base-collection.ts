import { IterableFactory } from './operators/iterable-factory';
import { Operator } from './operators/operator';
import { transform } from './transform';

export abstract class BaseCollection<T> {
  abstract iterableFactory(): IterableFactory<T>;

  transform<D>(
      t0: Operator<IterableFactory<T>, D>,
  ): D;
  transform<S0, D>(
      t0: Operator<IterableFactory<T>, S0>,
      t1: Operator<S0, D>,
  ): D;
  transform<S0, S1, D>(
      t0: Operator<IterableFactory<T>, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, D>,
  ): D;
  transform<S0, S1, S2, D>(
      t0: Operator<IterableFactory<T>, S0>,
      t1: Operator<S0, S1>,
      t2: Operator<S1, S2>,
      t3: Operator<S2, D>,
  ): D;
  transform<S0, S1, S2, S3, D>(
      t0: Operator<IterableFactory<T>, S0>,
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
