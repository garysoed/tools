import { assert, should, test } from 'gs-testing';

import { $ } from './chain';
import { filter } from './filter';

test('@tools/collect/operators/filter', () => {
  should(`exclude items that do not pass the check function`, () => {
    assert($(new Set([1, 2, 3, 4]), filter(i => i % 2 === 0))).to.startWith([2, 4]);
  });
});
