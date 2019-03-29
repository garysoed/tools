import { assert, setup, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../types/infinite-list';
import { takeWhile } from './take-while';

test('collect.operators.takeWhile', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = generatorFrom([0, 2, 3, 4, 5]);
  });

  should(`skip the items correctly`, () => {
    assert([...pipe(list, takeWhile(v => (v % 2) === 0))()]).to.haveExactElements([0, 2]);
  });
});
