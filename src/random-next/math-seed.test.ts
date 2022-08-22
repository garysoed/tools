import {assert, fake, should, spy} from 'gs-testing';

import {$asArray} from '../collect/operators/as-array';
import {$take} from '../collect/operators/take';
import {$pipe} from '../typescript/pipe';

import {mathSeed} from './math-seed';
import {randomGen} from './random-gen';


describe('@tools/random-next/math-seed', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      const sequence = $pipe(randomGen(mathSeed()), $take(5), $asArray());

      assert(sequence).to.haveExactElements([1, 2, 3, 4, 5]);
    });
  });
});
