import { assert, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable-list';
import { tail } from './tail';

test('collect.operators.tail', () => {
  should(`return the correct element`, () => {
    assert(ImmutableList.of([1, 2, 3]).$(tail())).to.equal(3);
  });
});
