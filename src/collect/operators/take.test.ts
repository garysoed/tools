import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$take} from './take';

test('@tools/collect/take', () => {
  should('return iterable that only returns the first few elements', () => {
    const inf = function*(): Generator<number> {
      while (true) {
        yield 1;
      }
    };

    assert($pipe(inf(), $take(5))).to.startWith([1, 1, 1, 1, 1]);
  });

  should('return empty iterable if count is zero', () => {
    const inf = function*(): Generator<number> {
      while (true) {
        yield 1;
      }
    };

    assert($pipe(inf(), $take(0))).to.beEmpty();
  });

  should('return all elements if count is too big', () => {
    assert($pipe([1, 2, 3], $take(5))).to.startWith([1, 2, 3]);
  });

  should('return empty iterable if count is negative', () => {
    const inf = function*(): Generator<number> {
      while (true) {
        yield 1;
      }
    };

    assert($pipe(inf(), $take(-5))).to.beEmpty();
  });
});
