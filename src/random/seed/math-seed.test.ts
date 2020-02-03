import { assert, fake, should, spy } from '@gs-testing';

import { RandomGenerator } from '../random-generator';

import { mathSeed } from './math-seed';


describe('@tools/random/seed/math-seed', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      assert(new RandomGenerator(mathSeed()).next(5)[0]).to.haveExactElements([1, 2, 3, 4, 5]);
    });
  });
});
