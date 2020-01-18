import { assert, fake, should, spy } from '@gs-testing';

import { randomTakeMultiple } from '../operators/random-take-multiple';

import { mathSeed } from './math-seed';


describe('@tools/random/seed/math-seed', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      assert(randomTakeMultiple(mathSeed(), 5, values => values)[0]).to
          .haveExactElements([1, 2, 3, 4, 5]);
    });
  });
});
