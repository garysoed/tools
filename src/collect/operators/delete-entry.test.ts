import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { deleteEntry } from './delete-entry';

test('collect.operators.deleteEntry', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = createInfiniteList([1, 2, 3, 4]);
  });

  should(`delete the entries correctly`, () => {
    assert([...exec(list, deleteEntry(1, 3, 4))()]).to.haveExactElements([2]);
  });
});
