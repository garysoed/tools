import { copyMetadata, countable } from '../generators';
import { IsFinite } from '../is-finite';
import { KeyedGenerator } from '../keyed-generator';
import { transform } from '../transform';
import { TypedGenerator } from '../typed-generator';
import { GeneratorMapOperator } from './generator-map-operator';
import { map } from './map';
import { takeWhile } from './take-while';
import { zip } from './zip';

export interface UntypedGeneratorMapOperator {
  <T>(from: KeyedGenerator<any, T>): KeyedGenerator<any, T> & IsFinite;
  <T>(from: TypedGenerator<T> & IsFinite): TypedGenerator<T> & IsFinite;
}

// TODO: Don't use any.
export function take<T>(count: number): GeneratorMapOperator<T, T>;
export function take(count: number): <T>(from: TypedGenerator<T>) => TypedGenerator<T> {
  return <T>(from: TypedGenerator<T>) => {
    return copyMetadata(
        transform(
            from,
            zip(countable()),
            takeWhile(([_, index]) => index < count),
            map(([value]) => value),
        ),
        from,
    );
  };
}
