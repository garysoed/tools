import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createImmutableList, ImmutableList } from '../types/immutable-list';
import { every } from './every';

test('collect.operators.every', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = createImmutableList([1, 2, 3]);
  });

  should(`return true if all the elements fulfill the check function`, () => {
    assert(exec(list, every(value => typeof value === 'number'))).to.beTrue();
  });

  should(`return false if an element does not fulfill the check function`, () => {
    assert(exec(list, every(value => value < 2))).to.beFalse();
  });

  should(`return true if empty`, () => {
    assert(exec(createImmutableList([]), every(value => false))).to.beTrue();
  });
});
