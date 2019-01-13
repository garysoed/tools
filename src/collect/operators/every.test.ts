import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { ImmutableList } from '../immutable-list';
import { every } from './every';

test('collect.operators.every', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = new ImmutableList(generatorFrom([1, 2, 3]));
  });

  should(`return true if all the elements fulfill the check function`, () => {
    assert(list.$(every(value => typeof value === 'number'))).to.beTrue();
  });

  should(`return false if an element does not fulfill the check function`, () => {
    assert(list.$(every(value => value < 2))).to.beFalse();
  });

  should(`return true if empty`, () => {
    assert(new ImmutableList(generatorFrom([])).$(every(value => false))).to.beTrue();
  });
});
