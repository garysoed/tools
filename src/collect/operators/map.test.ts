import { assert, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createInfiniteList } from '../types/infinite-list';
import { map } from './map';

test('collect.operators.map', () => {
  should(`map the values correctly`, () => {
    const list = createInfiniteList([1, 2, 3]);
    assert([...pipe(list, map(i => `${i}`))()]).to.haveExactElements(['1', '2', '3']);
  });
});
