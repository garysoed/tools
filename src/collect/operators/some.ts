import { FiniteGenerator } from '../types/generator';

export function some<T>(checkFn: (item: T) => boolean): (from: FiniteGenerator<T>) => boolean {
  return (from: FiniteGenerator<T>) => {
    for (const value of from()) {
      if (checkFn(value)) {
        return true;
      }
    }

    return false;
  };
}
