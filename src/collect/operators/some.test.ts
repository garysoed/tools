import { assert, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { createImmutableList } from '../types/immutable-list';
import { some } from './some';

test('collect.operators.some', () => {
  should(`return true if one of the elements matches`, () => {
    assert(pipe(createImmutableList([1, 3, 5]), some(i => i === 3))).to.beTrue();
  });

  should(`return false if none of the elements match`, () => {
    assert(pipe(createImmutableList([1, 3, 5]), some(i => i === 2))).to.beFalse();
  });
});
