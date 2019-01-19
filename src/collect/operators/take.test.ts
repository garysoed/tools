import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../types/infinite-list';
import { take } from './take';

test('collect.operators.take', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = generatorFrom([1, 2, 3, 4]);
  });

  should(`take the items correctly`, () => {
    assert([...exec(list, take(2))()]).to.haveExactElements([1, 2]);
    assert([...exec(list, take(0))()]).to.beEmpty();
  });

  should(`handle out of bound counts correctly`, () => {
    assert([...exec(list, take(-2))()]).to.beEmpty();
    assert([...exec(list, take(10))()]).to.haveExactElements([1, 2, 3, 4]);
  });
});
