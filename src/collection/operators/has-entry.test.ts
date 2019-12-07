import { assert, setup, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { hasEntry } from './has-entry';

test('collect.operators.hasEntry', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = createInfiniteList([1, 2, 3, 4]);
  });

  should(`return true if one of the specified values exist`, () => {
    assert(pipe(list, hasEntry(1, 5, 6))).to.beTrue();
  });

  should(`return false if none of the specified values exists`, () => {
    assert(pipe(list, hasEntry(5, 6))).to.beFalse();
  });
});
