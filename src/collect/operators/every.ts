import { FiniteGenerator } from '../types/generator';

export function every<T>(checkFn: (item: T) => boolean): (from: FiniteGenerator<T>) => boolean {
  return (from: FiniteGenerator<T>) => {
    for (const value of from()) {
      if (!checkFn(value)) {
        return false;
      }
    }

    return true;
  };
}
