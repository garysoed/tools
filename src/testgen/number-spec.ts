import { TestSpec } from '../testgen/test-spec';

const negative = TestSpec.of([-1]);
const positive = TestSpec.of([1]);
const zero = TestSpec.of([0]);
export const NumberSpec = {
  any: positive.or(negative).or(zero),
  negative,
  positive,
  zero,
};
