import {assert, fake, should, spy} from 'gs-testing';

import {$pipe} from '../../collect/operators/pipe';
import {$take} from '../../collect/operators/take';
import {fromSeed} from '../random';

import {mathSeed} from './math-seed';


describe('@tools/random/seed/math-seed', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      const sequence = $pipe(
          fromSeed(mathSeed()),
          $take(5),
      );

      assert(sequence).to.haveExactElements([1, 2, 3, 4, 5]);
    });
  });
});
