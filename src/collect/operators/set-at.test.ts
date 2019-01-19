import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { setAt } from './set-at';

test('collect.operators.setAt', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = createInfiniteList([1, 2, 3, 4]);
  });

  should(`set the value correctly`, () => {
    assert([...exec(list, setAt([0, 123], [2, 234]))()]).to.haveExactElements([123, 2, 234, 4]);
    assert([...exec(list, setAt([2, 123]))()]).to.haveExactElements([1, 2, 123, 4]);
  });

  should(`handle out of bound indexes correctly`, () => {
    assert([...exec(list, setAt([-1, 123]))()]).to.haveExactElements([1, 2, 3, 4]);
    assert([...exec(list, setAt([4, 123]))()]).to.haveExactElements([1, 2, 3, 4]);
  });
});
