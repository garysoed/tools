import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { filter } from './filter';

test('collect.operators.filter', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should('filter out items that do not match the predicate', () => {
    assert(list.transform(filter<number>(i => i > 2))()).to.startWith([3, 4]);
  });
});
