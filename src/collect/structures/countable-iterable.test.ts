import {assert, should, test} from 'gs-testing';

import {countableIterable} from './countable-iterable';

test('@tools/collect/structures/countable-iterable', () => {
  should('generate the correct items', () => {
    assert(countableIterable()).to.startWith([0, 1, 2, 3, 4]);
  });
});
