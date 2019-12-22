import { assert, should, test } from '@gs-testing';

import { $ } from './chain';
import { every } from './every';

test('@tools/collect/operators/every', () => {
  should(`return true if all elements are true`, () => {
    assert($(new Set([true, true, true]), every())).to.beTrue();
  });

  should(`return false if an element is false`, () => {
    assert($(new Set([true, false, true]), every())).to.beFalse();
  });
});
