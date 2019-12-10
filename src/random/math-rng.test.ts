import { assert, fake, should, spy } from '@gs-testing';

import { mathRng } from './math-rng';
import { randomTakeMultiple } from './operators/random-take-multiple';


describe('random.mathRng', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      assert(randomTakeMultiple(mathRng(), 5, values => values)[0]).to
          .haveElements([1, 2, 3, 4, 5]);
    });
  });
});
