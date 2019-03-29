import { assert, setup, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../types/infinite-list';
import { take } from './take';

test('collect.operators.take', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = generatorFrom([1, 2, 3, 4]);
  });

  should(`take the items correctly`, () => {
    assert([...pipe(list, take(2))()]).to.haveExactElements([1, 2]);
    assert([...pipe(list, take(0))()]).to.beEmpty();
  });

  should(`handle out of bound counts correctly`, () => {
    assert([...pipe(list, take(-2))()]).to.beEmpty();
    assert([...pipe(list, take(10))()]).to.haveExactElements([1, 2, 3, 4]);
  });
});
