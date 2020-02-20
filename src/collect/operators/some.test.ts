import { assert, should, test } from '@gs-testing';

import { $ } from './chain';
import { some } from './some';

test('@tools/collect/operators/some', () => {
  should(`return true if one of the elements is true`, () => {
    assert($(new Set([false, true, false]), some())).to.beTrue();
  });

  should(`return false if all elements are false`, () => {
    assert($(new Set([false, false, false]), some())).to.beFalse();
  });
});
