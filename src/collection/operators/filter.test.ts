import { assert, setup, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { filter } from './filter';

test('collect.operators.filter', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = createInfiniteList([1, 2, 3, 4]);
  });

  should('filter out items that do not match the predicate', () => {
    assert([...pipe(list, filter(i => i > 2))()]).to.haveExactElements([3, 4]);
  });
});
