import { assert, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createImmutableList } from '../types/immutable-list';
import { some } from './some';

test('collect.operators.some', () => {
  should(`return true if one of the elements matches`, () => {
    assert(exec(createImmutableList([1, 3, 5]), some(i => i === 3))).to.beTrue();
  });

  should(`return false if none of the elements match`, () => {
    assert(exec(createImmutableList([1, 3, 5]), some(i => i === 2))).to.beFalse();
  });
});
