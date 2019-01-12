import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { take } from './take';

test('collect.operators.take', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should(`take the items correctly`, () => {
    assert(list.transform(take(2))()).to.startWith([1, 2]);
    assert(list.transform(take(0))()).to.beEmpty();
  });

  should(`handle out of bound counts correctly`, () => {
    assert(list.transform(take(-2))()).to.beEmpty();
    assert(list.transform(take(10))()).to.startWith([1, 2, 3, 4]);
  });
});
