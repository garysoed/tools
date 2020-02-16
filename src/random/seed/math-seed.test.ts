import { assert, fake, should, spy } from '@gs-testing';

import { fromSeed } from '../random';

import { mathSeed } from './math-seed';


describe('@tools/random/seed/math-seed', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      const sequence = fromSeed(mathSeed())
          .next(5, ({random, rng}) => rng.map(() => random))
          .value;

      assert(sequence).to.haveExactElements([1, 2, 3, 4, 5]);
    });
  });
});
