import {assert, should, test} from 'gs-testing';

import {$pipe} from '../collect/operators/pipe';
import {$take} from '../collect/operators/take';

import {fromSeed} from './random';
import {FakeSeed} from './testing/fake-seed';


test('@tools/random/random', () => {
  test('[Symbol.iterator]', () => {
    should('iterate correctly', () => {
      const random = fromSeed(new FakeSeed([1, 2, 3]));
      const values1 = $pipe(random, $take(2));
      const values2 = $pipe(random, $take(3));

      assert(values1).to.haveExactElements([1, 2]);
      assert(values2).to.haveExactElements([3, 3, 3]);
    });
  });
});
