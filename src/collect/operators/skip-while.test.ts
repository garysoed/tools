import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../types/infinite-list';
import { skipWhile } from './skip-while';

test('collect.operators.skipWhile', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = generatorFrom([0, 2, 3, 4, 5]);
  });

  should(`skip the items correctly`, () => {
    assert([...exec(list, skipWhile(v => (v % 2) === 0))()]).to.haveExactElements([3, 4, 5]);
  });
});
