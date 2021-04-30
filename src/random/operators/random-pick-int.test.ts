import {assert, should, test} from 'gs-testing';

import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {randomPickInt} from './random-pick-int';


test('@tools/random/operators/random-pick-item', () => {
  should('return the correct integer from the range', () => {
    const rng = fromSeed(new FakeSeed([0.4]));

    assert(randomPickInt(0, 10, rng)).to.equal(4);
  });
});
