import { assert, should, test } from '@gs-testing';

import { take } from './iterables';

test('@tools/collect/iterables', () => {
  test('take', () => {
    should(`return iterable that only returns the first few elements`, () => {
      const inf = function*(): Generator<number> {
        while (true) {
          yield 1;
        }
      };

      assert(take(5, inf())).to.haveElements([1, 1, 1, 1, 1]);
    });

    should(`return empty iterable if count is zero`, () => {
      const inf = function*(): Generator<number> {
        while (true) {
          yield 1;
        }
      };

      assert(take(0, inf())).to.beEmpty();
    });

    should(`return all elements if count is too big`, () => {
      assert(take(5, [1, 2, 3])).to.haveElements([1, 2, 3]);
    });

    should(`return empty iterable if count is negative`, () => {
      const inf = function*(): Generator<number> {
        while (true) {
          yield 1;
        }
      };

      assert(take(-5, inf())).to.beEmpty();
    });
  });
});
