import { assertFinite } from '../generators';
import { TypedGenerator } from '../types/generator';

export function some<T, K>(checkFn: (item: T) => boolean): (from: TypedGenerator<T, K>) => boolean {
  return from => {
    assertFinite(from);

    for (const value of from()) {
      if (checkFn(value)) {
        return true;
      }
    }

    return false;
  };
}
