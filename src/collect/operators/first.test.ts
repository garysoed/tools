import { assert, should, test } from 'gs-testing';

import { $pipe } from './pipe';
import { first } from './first';

test('@tools/collect/first', () => {
  should('return the first element in the iterable', () => {
    assert($pipe([1, 2, 3], first())).to.equal(1);
  });

  should('return null if the iterable is empty', () => {
    assert($pipe([], first())).to.beNull();
  });
});
