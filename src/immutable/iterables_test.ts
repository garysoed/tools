import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList } from '../immutable/immutable-list';
import { Iterables } from '../immutable/iterables';

describe('immutable.Iterables', () => {
  describe('clone', () => {
    it('should return the correct clone', () => {
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

  describe('of', () => {
    it('should return the correct iterable object when given an iterator', () => {
      function* generator(): IterableIterator<number> {
        let i = 0;
        while (true) {
          yield i++;
        }
      }

      assert(Iterables.of(generator())).to.startWith([0, 1, 2, 3]);
    });

    it('should return the correct iterable object when given a generator', () => {
      function* generator(): IterableIterator<number> {
        let i = 0;
        while (true) {
          yield i++;
        }
      }

      assert(Iterables.of(generator)).to.startWith([0, 1, 2, 3]);
    });
  });

  describe('toArray', () => {
    it('should return the correct array', () => {
      const list = ImmutableList.of([1, 2, 3, 4]);
      assert(Iterables.toArray(list)).to.equal([1, 2, 3, 4]);
    });
  });
});
