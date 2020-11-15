import {assert, should, test} from 'gs-testing';

import {filter} from './filter';
import {$pipe} from './pipe';

test('@tools/collect/operators/filter', () => {
  should('exclude items that do not pass the check function', () => {
    assert($pipe(new Set([1, 2, 3, 4]), filter(i => i % 2 === 0))).to.startWith([2, 4]);
  });
});
