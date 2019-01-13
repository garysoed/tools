import { IsFinite } from '../is-finite';
import { TypedGenerator } from '../typed-generator';

export function size(): <T>(from: TypedGenerator<T> & IsFinite) => number {
  return <T>(from: TypedGenerator<T> & IsFinite) => {
    let i = 0;
    for (const _ of from()) {
      i++;
    }

    return i;
  };
}
