import {assert, should, test} from 'gs-testing';

import {$asArray} from '../collect/operators/as-array';
import {$map} from '../collect/operators/map';
import {$pipe} from '../collect/operators/pipe';
import {$take} from '../collect/operators/take';
import {countableIterable} from '../collect/structures/countable-iterable';

import {fromSeed} from './random';
import {FakeSeed} from './testing/fake-seed';


test('@tools/random/random', () => {
  test('[Symbol.iterator]', () => {
    should('iterate correctly', () => {
      const random = fromSeed(new FakeSeed([1, 2, 3]));
      const values1 = $pipe(countableIterable(), $take(2), $map(() => random.next()), $asArray());
      const values2 = $pipe(countableIterable(), $take(3), $map(() => random.next()), $asArray());

      assert(values1).to.haveExactElements([1, 2]);
      assert(values2).to.haveExactElements([3, 3, 3]);
    });
  });
});
