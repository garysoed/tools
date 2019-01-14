import { FiniteGenerator } from '../types/generator';

export function size(): <T>(from: FiniteGenerator<T>) => number {
  return <T>(from: FiniteGenerator<T>) => {
    let i = 0;
    for (const _ of from()) {
      i++;
    }

    return i;
  };
}
