import { assert, setup, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { createInfiniteMap, InfiniteMap } from '../types/infinite-map';
import { filterPick } from './filter-pick';
import { flat } from './flat';

test('collect.operators.filterPick', () => {
  let list: InfiniteMap<string, number>;

  setup(() => {
    list = createInfiniteMap([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
  });

  should('filter out items that do not match the predicate', () => {
    const filteredItems = pipe(
        list,
        filterPick(1, i => i > 2),
        flat(),
    );
    assert([...filteredItems()]).to.haveExactElements(['c', 3, 'd', 4]);
  });
});
