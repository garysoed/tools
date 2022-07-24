import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$first} from './first';

test('@tools/collect/first', () => {
  should('return the first element in the iterable', () => {
    assert($pipe([1, 2, 3], $first())).to.equal(1);
  });

  should('handle falsy element', () => {
    assert($pipe([0, 2, 3], $first())).to.equal(0);
  });

  should('return null if the iterable is empty', () => {
    assert($pipe([], $first())).to.beNull();
  });
});
