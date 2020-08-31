import { assert, should, test } from 'gs-testing';

import { $pipe } from '../collect/operators/pipe';
import { take } from '../collect/operators/take';

import { fromSeed } from './random';
import { FakeSeed } from './testing/fake-seed';


test('@tools/random/random', () => {
  test('iterable', () => {
    should(`return iterable with values`, () => {
      const values = $pipe(
          fromSeed(new FakeSeed([1, 2, 3])).iterable(),
          take(5),
      );

      assert(values).to.haveExactElements([1, 2, 3, 3, 3]);
    });
  });

  test('next', () => {
    should(`get the next value of the seed`, () => {
      const random = fromSeed(new FakeSeed([1, 2, 3])).next();

      assert(random).to.equal(1);
    });
  });
});
