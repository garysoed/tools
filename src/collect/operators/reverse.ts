import { generatorFrom } from '../generators';
import { IsFinite } from '../is-finite';
import { TypedGenerator } from '../typed-generator';

export function reverse(): <T>(from: TypedGenerator<T> & IsFinite) => TypedGenerator<T> & IsFinite {
  return <T>(from: TypedGenerator<T> & IsFinite) => {
    const array = [...from()].reverse();

    return generatorFrom(array);
  };
}
