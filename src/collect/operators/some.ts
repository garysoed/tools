import { toArray } from '../generators';
import { TypedGenerator } from '../types/generator';

export function some<T, K>(checkFn: (item: T) => boolean): (from: TypedGenerator<T, K>) => boolean {
  return from => {
    for (const value of toArray(from)) {
      if (checkFn(value)) {
        return true;
      }
    }

    return false;
  };
}
