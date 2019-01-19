import { assert, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createImmutableList } from '../types/immutable-list';
import { tail } from './tail';

test('collect.operators.tail', () => {
  should(`return the correct element`, () => {
    assert(exec(createImmutableList([1, 2, 3]), tail())).to.equal(3);
  });
});
