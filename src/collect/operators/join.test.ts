import { assert, should, test } from '@gs-testing';

import { $ } from './chain';
import { join } from './join';

test('@tools/collect/operators/join', () => {
  should(`join the items`, () => {
    assert($(['a', 'b', 'c'], join(','))).to.equal('a,b,c');
  });
});
