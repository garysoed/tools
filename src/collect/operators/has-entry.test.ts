import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { deleteEntry } from './delete-entry';
import { hasEntry } from './has-entry';

test('collect.operators.hasEntry', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3, 4]));
  });

  should(`return true if one of the specified values exist`, () => {
    assert(list.$(hasEntry(1, 5, 6))).to.beTrue();
  });

  should(`return false if none of the specified values exists`, () => {
    assert(list.$(hasEntry(5, 6))).to.beFalse();
  });
});
