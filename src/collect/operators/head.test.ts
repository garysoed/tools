import { assert, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { head } from './head';

test('collect.operators.head', () => {
  should(`take the first element`, () => {
    assert(exec(createInfiniteList([1, 2, 3]), head())).to.equal(1);
  });

  should(`return undefined if empty`, () => {
    assert(exec(createInfiniteList([]), head())).toNot.beDefined();
  });
});
