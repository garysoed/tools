import { assert, should, test } from '@gs-testing';

import { RandomGenerator } from '../random-generator';
import { fakeSeed } from '../testing/fake-seed';

import { randomPickWeighted } from './random-pick-weighted';


test('@tools/random/random-pick-weighted', () => {
  should(`return the value at the given random result`, () => {
    assert(randomPickWeighted([['a', 2], ['b', 3]], new RandomGenerator(fakeSeed([0.5])))[0])
        .to.equal('b');
  });

  should(`return null if the array is empty`, () => {
    assert(randomPickWeighted([], new RandomGenerator(fakeSeed([0.5])))[0]).to.beNull();
  });
});
