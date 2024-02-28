import {assert, should, test} from 'gs-testing';

import {matches} from './matches';

test('@tools/collect/compare/matches', () => {
  should('order matching items at the start of the list', () => {
    const list = [1, 2, 3];
    list.sort(matches((v) => v > 1));

    assert(list).to.haveExactElements([2, 3, 1]);
  });
});
