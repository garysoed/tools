import { assert, should, test } from '@gs-testing';

import { fromSeed } from './random';
import { FakeSeed } from './testing/fake-seed';

test('@tools/random/random', () => {
  test('map', () => {
    should(`return a random object with the given value`, () => {
      const value = 123;

      assert(fromSeed(new FakeSeed([1])).map(() => value).value).to.equal(value);
    });
  });

  test('next', () => {
    should(`get the next value of the seed`, () => {
      const next = fromSeed(new FakeSeed([1, 2, 3])).next(({random, rng}) => rng.map(() => random));

      assert(next.value).to.equal(1);
    });

    should(`get the next values of the seed`, () => {
      const next = fromSeed(new FakeSeed([1, 2, 3]))
          .next(2, ({random, rng}) => rng.map(() => random));

      assert(next.value).to.haveExactElements([1, 2]);
    });
  });
});
