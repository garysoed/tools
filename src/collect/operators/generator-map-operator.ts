import { IsFinite } from '../is-finite';
import { KeyedGenerator } from '../keyed-generator';
import { TypedGenerator } from '../typed-generator';

export interface GeneratorMapOperator<F, T> {
  (from: KeyedGenerator<any, F>): KeyedGenerator<any, T>;
  (from: TypedGenerator<F> & IsFinite): TypedGenerator<T> & IsFinite;
  (from: TypedGenerator<F>): TypedGenerator<T>;
}
