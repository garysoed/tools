import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { setAt } from './set-at';

test('collect.operators.setAt', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should(`set the value correctly`, () => {
    assert(list.transform(setAt(123, 0))()).to.startWith([123, 2, 3, 4]);
    assert(list.transform(setAt(123, 2))()).to.startWith([1, 2, 123, 4]);
  });

  should(`handle out of bound indexes correctly`, () => {
    assert(list.transform(setAt(123, -1))()).to.startWith([1, 2, 3, 4]);
    assert(list.transform(setAt(123, 4))()).to.startWith([1, 2, 3, 4]);
  });
});
