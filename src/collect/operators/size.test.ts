import { assert, should, test } from 'gs-testing';

import { $ } from './chain';
import { size } from './size';

test('@tools/collect/size', () => {
  should(`return the correct size for an array`, () => {
    assert($([1, 2, 3], size())).to.equal(3);
  });

  should(`return the correct size for a set`, () => {
    assert($(new Set([1, 2, 3]), size())).to.equal(3);
  });

  should(`return the correct size for a map`, () => {
    assert($(new Map([[1, 'a'], [2, 'b'], [3, 'c']]), size())).to.equal(3);
  });
});
