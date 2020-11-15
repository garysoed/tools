import {assert, should, test} from 'gs-testing';

import {natural} from './natural';
import {withMap} from './with-map';

test('@tools/collect/compare/with-map', () => {
  should('order the items correctly', () => {
    const a = {v: 1};
    const b = {v: 2};
    const list = [b, a];

    list.sort(withMap(item => `${item.v}`, natural()));
    assert(list).to.haveExactElements([a, b]);
  });
});
