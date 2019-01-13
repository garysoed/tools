import { assert, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable-list';
import { some } from './some';

test('collect.operators.some', () => {
  should(`return true if one of the elements matches`, () => {
    assert(ImmutableList.of([1, 3, 5]).$(some(i => i === 3))).to.beTrue();
  });

  should(`return false if none of the elements match`, () => {
    assert(ImmutableList.of([1, 3, 5]).$(some(i => i === 2))).to.beFalse();
  });
});
