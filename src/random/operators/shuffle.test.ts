import { assert, should, test } from 'gs-testing';

import { fromSeed } from '../random';
import { FakeSeed } from '../testing/fake-seed';

import { shuffle } from './shuffle';

test('@tools/random/operators/shuffle', () => {
  should(`order the items correctly`, () => {
    const seed = new FakeSeed([0.5, 0, 1]);

    const shuffled = shuffle([5, 2, 4], fromSeed(seed), v => Math.floor(v / 2)).value;
    assert(shuffled).to.haveExactElements([2, 5, 4]);
  });
});
