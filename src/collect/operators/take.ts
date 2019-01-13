import { countable } from '../generators';
import { transform } from '../transform';
import { TypedGenerator } from '../typed-generator';
import { map } from './map';
import { takeWhile } from './take-while';
import { zip } from './zip';

export function take(count: number): <T>(from: TypedGenerator<T>) => TypedGenerator<T> {
  return <T>(from: TypedGenerator<T>) => {
    return transform(
        from,
        zip(countable()),
        takeWhile(([_, index]) => index < count),
        map(([value]) => value),
    );
  };
}
