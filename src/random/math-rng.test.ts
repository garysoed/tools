import { assert, fake, should, spy } from '@gs-testing';

import { $ } from '../collect/chain';
import { map } from '../collect/map';
import { take } from '../collect/take';

import { mathRng } from './math-rng';


describe('random.mathRng', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      assert($(mathRng(), take(5), map(({item: value}) => value))).to.haveElements([1, 2, 3, 4, 5]);
    });
  });
});
