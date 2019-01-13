import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { skipWhile } from './skip-while';
import { takeWhile } from './take-while';

test('collect.operators.takeWhile', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([0, 2, 3, 4, 5]));
  });

  should(`skip the items correctly`, () => {
    assert([...list.$(takeWhile(v => (v % 2) === 0))()]).to.haveExactElements([0, 2]);
  });
});
