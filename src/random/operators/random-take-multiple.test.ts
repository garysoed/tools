import { assert, should, test } from '@gs-testing';

import { fakeRng } from '../testing/fake-rng';

import { randomTakeMultiple } from './random-take-multiple';

test('@tools/random/operators/random-take-multiple', () => {
  should(`return multiple values`, () => {
    const [sum, newRng] = randomTakeMultiple(
        fakeRng([1, 2, 3, 4, 5]),
        3,
        ([value0, value1, value2]) => value0 + value1 + value2,
    );

    const [sum2] = randomTakeMultiple(newRng, 2, ([value0, value1]) => value0 + value1);
    assert(sum).to.equal(6);
    assert(sum2).to.equal(9);
  });
});
