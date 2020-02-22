import { assert, should, test } from 'gs-testing';

import { $ } from './chain';
import { skip } from './skip';
import { take } from './take';

test('@tools/collect/skip', () => {
  should(`return iterable that skips the first few elements`, () => {
    assert($([0, 1, 2, 3, 4, 5, 6], skip(2))).to.startWith([2, 3, 4, 5, 6]);
  });

  should(`return all elements if count is zero`, () => {
    assert($([0, 1, 2, 3], skip(0), take(5))).to.startWith([0, 1, 2, 3]);
  });

  should(`return empty iterable if count is too big`, () => {
    assert($([1, 2, 3], skip(5))).to.beEmpty();
  });

  should(`return all elements if count is negative`, () => {
    assert($([0, 1, 2, 3], skip(-5))).to.startWith([0, 1, 2, 3]);
  });
});
