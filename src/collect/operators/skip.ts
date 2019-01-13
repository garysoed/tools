import { countable } from '../generators';
import { transform } from '../transform';
import { TypedGenerator } from '../typed-generator';
import { map } from './map';
import { skipWhile } from './skip-while';
import { zip } from './zip';

export function skip(count: number): <T>(from: TypedGenerator<T>) => TypedGenerator<T> {
  return <T>(from: TypedGenerator<T>) => {
    return transform(
        from,
        zip(countable()),
        skipWhile(([_, index]) => index < count),
        map(([value]) => value),
    );
  };
}
