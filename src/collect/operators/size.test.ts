import { assert, setup, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable-list';
import { size } from './size';

test('collect.operators.size', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = ImmutableList.of([1, 2, 3]);
  });

  should(`return the correct size`, () => {
    assert(list.$(size())).to.equal(3);
  });
});
