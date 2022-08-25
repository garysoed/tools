import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$takeWhile} from './take-while';

test('@tools/collect/take-while', () => {
  should('return iterable that takes elements while they met the criteria', () => {
    const inf = function*(): Generator<number> {
      let i = 0;
      while (true) {
        yield i;
        i++;
      }
    };

    assert($pipe(inf(), $takeWhile(value => value < 5))).to.startWith([0, 1, 2, 3, 4]);
  });

  should('return empty iterable if nothing matches', () => {
    const inf = function*(): Generator<number> {
      while (true) {
        yield 1;
      }
    };

    assert($pipe(inf(), $takeWhile(value => value !== 1))).to.beEmpty();
  });

  should('return all elements if everything passes the predicate', () => {
    assert($pipe([1, 2, 3], $takeWhile(() => true))).to.startWith([1, 2, 3]);
  });
});
