import { assertFinite } from '../generators';
import { TypedGenerator } from '../types/generator';

export function every<T, K>(
    checkFn: (item: T) => boolean,
): (from: TypedGenerator<T, K>) => boolean {
  return (from: TypedGenerator<T, K>) => {
    assertFinite(from);
    for (const value of from()) {
      if (!checkFn(value)) {
        return false;
      }
    }

    return true;
  };
}
