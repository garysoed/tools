import { toArray } from '../generators';
import { TypedGenerator } from '../types/generator';

export function every<T, K>(
    checkFn: (item: T) => boolean,
): (from: TypedGenerator<T, K>) => boolean {
  return (from: TypedGenerator<T, K>) => {
    for (const value of toArray(from)) {
      if (!checkFn(value)) {
        return false;
      }
    }

    return true;
  };
}
