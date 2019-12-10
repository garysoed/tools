import { RandomGenerator, RandomResult } from '../random-generator';

export function randomTake<T>(
    randomGenerator: RandomGenerator,
    fn: (value: number) => T,
): RandomResult<T> {
  const [value, nextGenerator] = randomGenerator.next();

  return [fn(value), nextGenerator];
}
