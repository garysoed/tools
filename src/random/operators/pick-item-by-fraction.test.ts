import {assert, should, test} from 'gs-testing';

import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {pickItemByFraction} from './pick-item-by-fraction';


test('@tools/random/operators/pick-item-by-fraction', () => {
  should('return the correct member of the list', () => {
    const rng = fromSeed(new FakeSeed([0.6]));

    assert(pickItemByFraction(['a', 'b', 'c', 'd', 'e'], rng)).to.equal('d');
  });
});
