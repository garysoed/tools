import { assert, setup, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { insertAt } from './insert-at';

test('collect.operators.insertAt', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = createInfiniteList([1, 2, 3]);
  });

  should(`insert the new value correctly`, () => {
    assert([...pipe(list, insertAt([123, 0], [234, 2]))()]).to
        .haveExactElements([123, 1, 2, 234, 3]);
    assert([...pipe(list, insertAt([123, 1]))()]).to.haveExactElements([1, 123, 2, 3]);
    assert([...pipe(list, insertAt([123, 3]))()]).to.haveExactElements([1, 2, 3, 123]);
  });

  should(`handle out of bound indexes correctly`, () => {
    assert([...pipe(list, insertAt([123, -1]))()]).to.haveExactElements([123, 1, 2, 3]);
    assert([...pipe(list, insertAt([123, 300]))()]).to.haveExactElements([1, 2, 3, 123]);
  });
});
