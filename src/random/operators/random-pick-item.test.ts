import {assert, should, test} from 'gs-testing';

import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {randomPickItem} from './random-pick-item';


test('@tools/random/operators/random-pick-item', () => {
  should('return the correct member of the list', () => {
    const rng = fromSeed(new FakeSeed([0.6]));

    assert(randomPickItem(['a', 'b', 'c', 'd', 'e'], rng)).to.equal('d');
  });
});
