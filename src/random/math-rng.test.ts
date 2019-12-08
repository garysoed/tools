import { assert, fake, should, spy } from '@gs-testing';

import { $ } from '../collect/chain';
import { take } from '../collect/take';

import { mathRng } from './math-rng';


describe('random.mathRng', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      assert($(mathRng(), take(5))).to.haveElements([1, 2, 3, 4, 5]);
    });
  });
});
