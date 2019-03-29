import { assert, setup, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../types/infinite-list';
import { skip } from './skip';

test('collect.operators.skip', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = generatorFrom([1, 2, 3, 4]);
  });

  should(`skip the items correctly`, () => {
    assert([...pipe(list, skip(2))()]).to.haveExactElements([3, 4]);
    assert([...pipe(list, skip(0))()]).to.haveExactElements([1, 2, 3, 4]);
  });

  should(`handle out of bound counts correctly`, () => {
    assert([...pipe(list, skip(-2))()]).to.haveExactElements([1, 2, 3, 4]);
    assert([...pipe(list, skip(5))()]).to.beEmpty();
  });
});
