import {assert, should, test} from 'gs-testing';

import {$first} from '../../collect/operators/first';
import {$pipe} from '../../collect/operators/pipe';
import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {$pickIntByFraction} from './pick-int-by-fraction';


test('@tools/random/operators/pick-int-by-fraction', () => {
  should('return the correct integer from the range', () => {
    const rng = fromSeed(new FakeSeed([0.4]));

    assert($pipe(rng, $pickIntByFraction(0, 10), $first())).to.equal(4);
  });
});
