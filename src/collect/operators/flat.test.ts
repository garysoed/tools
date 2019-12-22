import { assert, should, test } from '@gs-testing';

import { $ } from './chain';
import { flat } from './flat';

test('@tools/collect/operators/flat', () => {
  should(`flatten the elements`, () => {
    assert($([[1, 2], [3], [4, 5]], flat())).to.haveElements([1, 2, 3, 4, 5]);
  });
});
