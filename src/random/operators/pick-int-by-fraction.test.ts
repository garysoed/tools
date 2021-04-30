import {assert, should, test} from 'gs-testing';

import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {pickIntByFraction} from './pick-int-by-fraction';


test('@tools/random/operators/pick-int-by-fraction', () => {
  should('return the correct integer from the range', () => {
    const rng = fromSeed(new FakeSeed([0.4]));

    assert(pickIntByFraction(0, 10, rng)).to.equal(4);
  });
});
