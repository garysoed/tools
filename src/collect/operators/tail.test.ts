import { assert, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createImmutableList } from '../types/immutable-list';
import { tail } from './tail';

test('collect.operators.tail', () => {
  should(`return the correct element`, () => {
    assert(pipe(createImmutableList([1, 2, 3]), tail())).to.equal(3);
  });
});
