import { IsFinite } from '../is-finite';
import { TypedGenerator } from '../typed-generator';

export function some<T>(
    checkFn: (item: T) => boolean,
): (from: TypedGenerator<T> & IsFinite) => boolean {
  return (from: TypedGenerator<T> & IsFinite) => {
    for (const value of from()) {
      if (checkFn(value)) {
        return true;
      }
    }

    return false;
  };
}
