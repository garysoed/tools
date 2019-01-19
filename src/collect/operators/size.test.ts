import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createImmutableList, ImmutableList } from '../types/immutable-list';
import { size } from './size';

test('collect.operators.size', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = createImmutableList([1, 2, 3]);
  });

  should(`return the correct size`, () => {
    assert(exec(list, size())).to.equal(3);
  });
});
