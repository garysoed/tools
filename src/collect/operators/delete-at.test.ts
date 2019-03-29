import { assert, setup, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { deleteAt } from './delete-at';

test('collect.operators.deleteAt', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = createInfiniteList([1, 2, 3, 4]);
  });

  should(`delete the item correctly`, () => {
    assert([...pipe(list, deleteAt(0, 3))()]).to.haveExactElements([2, 3]);
    assert([...pipe(list, deleteAt(1))()]).to.haveExactElements([1, 3, 4]);
  });

  should(`do nothing if the index is out of bound`, () => {
    assert([...pipe(list, deleteAt(-1))()]).to.haveExactElements([1, 2, 3, 4]);
    assert([...pipe(list, deleteAt(4))()]).to.haveExactElements([1, 2, 3, 4]);
  });
});
