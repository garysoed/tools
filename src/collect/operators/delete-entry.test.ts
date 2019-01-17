import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { deleteEntry } from './delete-entry';

test('collect.operators.deleteEntry', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should(`delete the entries correctly`, () => {
    assert([...list.$(deleteEntry(1, 3, 4))()]).to.haveExactElements([2]);
  });
});
