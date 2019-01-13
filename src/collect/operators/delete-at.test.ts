import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { deleteAt } from './delete-at';

test('collect.operators.deleteAt', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should(`delete the item correctly`, () => {
    assert([...list.$(deleteAt(0, 3))()]).to.haveExactElements([2, 3]);
    assert([...list.$(deleteAt(1))()]).to.haveExactElements([1, 3, 4]);
  });

  should(`do nothing if the index is out of bound`, () => {
    assert([...list.$(deleteAt(-1))()]).to.haveExactElements([1, 2, 3, 4]);
    assert([...list.$(deleteAt(4))()]).to.haveExactElements([1, 2, 3, 4]);
  });
});
