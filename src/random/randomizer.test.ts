import { assert, should, test } from '@gs-testing';

import { RandomGenerator } from './random-generator';
import { intRange, list, shortId } from './randomizer';
import { fakeSeed } from './testing/fake-seed';


test('random.Randomizer', () => {
  test('intRange', () => {
    should('return the correct integer from the range', () => {
      const rng = new RandomGenerator(fakeSeed([0.4]));

      assert(intRange(0, 10, rng)[0]).to.equal(4);
    });
  });

  test('list', () => {
    should('return the correct member of the list', () => {
      const rng = new RandomGenerator(fakeSeed([0.6]));

      assert(list(['a', 'b', 'c', 'd', 'e'], rng)[0]).to.equal('d');
    });
  });

  test('shortId', () => {
    should('generate the correct ID', () => {
      const rng = new RandomGenerator(fakeSeed([
        0 / 62,
        10 / 62,
        11 / 62,
        12 / 62,
        36 / 62,
        37 / 62,
        38 / 62,
      ]));

      assert(shortId(rng)[0]).to.equal('0ABCabc');
    });
  });
});
