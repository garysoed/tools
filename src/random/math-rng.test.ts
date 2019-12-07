import { assert, fake, should, spy } from '@gs-testing';

import * as iterables from '../collect/iterables';

import { mathRng } from './math-rng';


describe('random.mathRng', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      assert(iterables.take(5, mathRng())).to.haveElements([1, 2, 3, 4, 5]);
    });
  });
});
