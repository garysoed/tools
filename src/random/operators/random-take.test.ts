import { assert, should, test } from '@gs-testing';

import { fakeRng } from '../testing/fake-rng';

import { randomTake } from './random-take';

test('@tools/random/operators/random-take', () => {
  should(`return the correct value and new generator`, () => {
    const rng = fakeRng([1, 2, 3]);

    const [value1, rng1] = randomTake(rng, value => `${value}`);
    const [value2] = randomTake(rng1, value => `${value}`);

    assert(value1).to.equal('1');
    assert(value2).to.equal('2');
  });
});
