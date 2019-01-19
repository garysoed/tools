import { toArray } from '../generators';
import { TypedGenerator } from '../types/generator';

export function size<T, K>(): (from: TypedGenerator<T, K>) => number {
  return (from: TypedGenerator<T, K>) => {
    let i = 0;
    for (const _ of toArray(from)) {
      i++;
    }

    return i;
  };
}
