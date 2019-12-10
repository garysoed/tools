import { RandomGenerator, RandomResult } from '../random-generator';

export function randomTakeMultiple<T>(
    generator: RandomGenerator,
    count: number,
    fn: (values: number[]) => T,
): RandomResult<T> {
  const values: number[] = [];
  let nextGenerator = generator;
  for (let i = 0; i < count; i++) {
    const result = nextGenerator.next();
    values.push(result[0]);
    nextGenerator = result[1];
  }

  return [fn(values), nextGenerator];
}
