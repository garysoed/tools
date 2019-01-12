import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { skip } from './skip';

test('collect.operators.skip', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should(`skip the items correctly`, () => {
    assert([...list.transform(skip(2))()]).to.haveExactElements([3, 4]);
    assert([...list.transform(skip(0))()]).to.haveExactElements([1, 2, 3, 4]);
  });

  should(`handle out of bound counts correctly`, () => {
    assert([...list.transform(skip(-2))()]).to.haveExactElements([1, 2, 3, 4]);
    assert([...list.transform(skip(5))()]).to.beEmpty();
  });
});
