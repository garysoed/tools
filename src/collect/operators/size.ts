import { assertFinite } from '../generators';
import { TypedGenerator } from '../types/generator';

export function size<T, K>(): (from: TypedGenerator<T, K>) => number {
  return (from: TypedGenerator<T, K>) => {
    assertFinite(from);
    let i = 0;
    for (const _ of from()) {
      i++;
    }

    return i;
  };
}
