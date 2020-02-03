import { assert, init, should, test } from '@gs-testing';

import { RandomGenerator } from './random-generator';
import { fakeSeed } from './testing/fake-seed';

test('@tools/random/random-generator', () => {
  test('next', () => {
    should(`return a value randomly`, () => {
      const seed = fakeSeed([1, 2, 3]);
      const generator = new RandomGenerator(seed);

      const [value1, generator1] = generator.next();
      const [value2] = generator1.next();

      assert(value1).to.equal(1);
      assert(value2).to.equal(2);
    });

    should(`return multiple values as specified`, () => {
      const seed = fakeSeed([1, 2, 3, 4, 5]);
      const generator = new RandomGenerator(seed);

      const [value1, generator1] = generator.next(2);
      const [value2] = generator1.next(1);

      assert(value1).to.haveExactElements([1, 2]);
      assert(value2).to.haveExactElements([3]);
    });
  });
});
