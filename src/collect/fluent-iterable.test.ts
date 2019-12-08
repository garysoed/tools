import { assert, should, test } from '@gs-testing';

import { FluentIterable } from './fluent-iterable';

test('@tools/collect/fluent-iterable', () => {
  test('take', () => {
    should(`return iterable that only returns the first few elements`, () => {
      const inf = function*(): Generator<number> {
        while (true) {
          yield 1;
        }
      };

      assert(new FluentIterable(inf()).take(5)).to.haveElements([1, 1, 1, 1, 1]);
    });

    should(`return empty iterable if count is zero`, () => {
      const inf = function*(): Generator<number> {
        while (true) {
          yield 1;
        }
      };

      assert(new FluentIterable(inf()).take(0)).to.beEmpty();
    });

    should(`return all elements if count is too big`, () => {
      assert(new FluentIterable([1, 2, 3]).take(5)).to.haveElements([1, 2, 3]);
    });

    should(`return empty iterable if count is negative`, () => {
      const inf = function*(): Generator<number> {
        while (true) {
          yield 1;
        }
      };

      assert(new FluentIterable(inf()).take(-5)).to.beEmpty();
    });
  });
});
