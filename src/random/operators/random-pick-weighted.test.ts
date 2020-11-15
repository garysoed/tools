import {assert, should, test} from 'gs-testing';

import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {randomPickWeighted} from './random-pick-weighted';


test('@tools/random/random-pick-weighted', () => {
  should('return the value at the given random result', () => {
    assert(randomPickWeighted([['a', 2], ['b', 3]], fromSeed(new FakeSeed([0.5]))))
        .to.equal('b');
  });

  should('return null if the array is empty', () => {
    assert(randomPickWeighted([], fromSeed(new FakeSeed([0.5])))).to.beNull();
  });
});
