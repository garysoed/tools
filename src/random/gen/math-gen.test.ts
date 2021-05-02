import {assert, fake, should, spy} from 'gs-testing';

import {$asArray} from '../../collect/operators/as-array';
import {$map} from '../../collect/operators/map';
import {$pipe} from '../../collect/operators/pipe';
import {$take} from '../../collect/operators/take';
import {countableIterable} from '../../collect/structures/countable-iterable';
import {fromSeed} from '../random';

import {mathGen} from './math-gen';


describe('@tools/random/gen/math-gen', () => {
  describe('next', () => {
    should('return the value returned from Math.random', () => {
      fake(spy(Math, 'random')).always().returnValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

      const rng = fromSeed(mathGen());
      const sequence = $pipe(
          countableIterable(),
          $take(5),
          $map(() => rng.next()),
          $asArray(),
      );

      assert(sequence).to.haveExactElements([1, 2, 3, 4, 5]);
    });
  });
});
