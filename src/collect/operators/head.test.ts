import { assert, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createInfiniteList, InfiniteList } from '../types/infinite-list';
import { head } from './head';

test('collect.operators.head', () => {
  should(`take the first element`, () => {
    assert(pipe(createInfiniteList([1, 2, 3]), head())).to.equal(1);
  });

  should(`return undefined if empty`, () => {
    assert(pipe(createInfiniteList([]), head())).toNot.beDefined();
  });
});
