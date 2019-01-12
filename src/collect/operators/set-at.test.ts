import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { setAt } from './set-at';

test('collect.operators.setAt', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should(`set the value correctly`, () => {
    assert([...list.transform(setAt([0, 123], [2, 234]))()]).to.haveExactElements([123, 2, 234, 4]);
    assert([...list.transform(setAt([2, 123]))()]).to.haveExactElements([1, 2, 123, 4]);
  });

  should(`handle out of bound indexes correctly`, () => {
    assert([...list.transform(setAt([-1, 123]))()]).to.haveExactElements([1, 2, 3, 4]);
    assert([...list.transform(setAt([4, 123]))()]).to.haveExactElements([1, 2, 3, 4]);
  });
});
