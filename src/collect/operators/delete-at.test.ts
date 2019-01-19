import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { deleteAt } from './delete-at';

test('collect.operators.deleteAt', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = createInfiniteList([1, 2, 3, 4]);
  });

  should(`delete the item correctly`, () => {
    assert([...exec(list, deleteAt(0, 3))()]).to.haveExactElements([2, 3]);
    assert([...exec(list, deleteAt(1))()]).to.haveExactElements([1, 3, 4]);
  });

  should(`do nothing if the index is out of bound`, () => {
    assert([...exec(list, deleteAt(-1))()]).to.haveExactElements([1, 2, 3, 4]);
    assert([...exec(list, deleteAt(4))()]).to.haveExactElements([1, 2, 3, 4]);
  });
});
