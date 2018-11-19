import { assert, should } from 'gs-testing/export/main';
import { Iterables } from '../immutable';

describe('immutable.Iterables', () => {
  describe('clone', () => {
    should('return the correct clone', () => {
      function* generator(): IterableIterator<number> {
        let i = 0;
        while (true) {
          yield i++;
        }
      }
      const clone = Iterables.clone(Iterables.of(generator));
      assert(clone).to.startWith([0, 1, 2, 3, 4]);
    });
  });

  describe('flatten', () => {
    should(`output correctly`, () => {
      assert(Iterables.flatten(['a', [1, 2, 3], [['b'], 4]])).to.equal(['a', 1, 2, 3, ['b'], 4]);
    });
  });

  describe('of', () => {
    should('return the correct iterable object when given an iterator', () => {
      function* generator(): IterableIterator<number> {
        let i = 0;
        while (true) {
          yield i++;
        }
      }

      assert(Iterables.of(generator())).to.startWith([0, 1, 2, 3]);
    });

    should('return the correct iterable object when given a generator', () => {
      function* generator(): IterableIterator<number> {
        let i = 0;
        while (true) {
          yield i++;
        }
      }

      assert(Iterables.of(generator)).to.startWith([0, 1, 2, 3]);
    });
  });

  describe('unsafeEquals', () => {
    should(`return true if the two iterables are recursively the same`, () => {
      const iterable1 = ['a', [1, 2, 3], 'c'];
      const iterable2 = ['a', [1, 2, 3], 'c'];

      assert(Iterables.unsafeEquals(iterable1, iterable2)).to.beTrue();
    });

    should(`return false if one of the elements are different`, () => {
      const iterable1 = ['a', [1, 2, 3], 'c'];
      const iterable2 = ['b', [1, 2, 3], 'c'];

      assert(Iterables.unsafeEquals(iterable1, iterable2)).to.beFalse();
    });

    should(`return false if one of the recursive elements are different`, () => {
      const iterable1 = ['a', [1, 2, 3], 'c'];
      const iterable2 = ['a', [2, 2, 3], 'c'];

      assert(Iterables.unsafeEquals(iterable1, iterable2)).to.beFalse();
    });

    should(`return false if the lengths are different`, () => {
      const iterable1 = ['a', [1, 2, 3], 'c'];
      const iterable2 = ['b', [1, 2, 3]];

      assert(Iterables.unsafeEquals(iterable1, iterable2)).to.beFalse();
    });

    should(`return true for two equal strings`, () => {
      assert(Iterables.unsafeEquals('abc', 'abc')).to.beTrue();
    });

    should(`return false for two different strings`, () => {
      assert(Iterables.unsafeEquals('abc', 'bcd')).to.beFalse();
    });
  });
});
