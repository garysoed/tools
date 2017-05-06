import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Iterables } from '../immutable/iterables';


describe('immutable.Iterables', () => {
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
});
