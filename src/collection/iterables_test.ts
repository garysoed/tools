import {assert, Matchers, TestBase} from 'src/test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Arrays} from './arrays';
import {GeneratorIterable} from './generator-iterable';
import {Iterables} from './iterables';


describe('collection.Iterables', () => {
  describe('addAll', () => {
    it('should append all the given elements after the current iterable elements', () => {
      let firstIterable = ArrayIterable.newInstance([1, 2, 3]);
      let secondIterable = ArrayIterable.newInstance([4, 5, 6]);
      let result = Iterables.of(firstIterable).addAll(secondIterable).asIterable();
      assert(Arrays.fromIterable(result).asArray()).to.equal([1, 2, 3, 4, 5, 6]);
    });

    it('should work with infinite iterable', () => {
      let infiniteIterable = GeneratorIterable.newInstance(() => {
        return {done: false, value: 0};
      });
      Iterables.of<number>(ArrayIterable.newInstance([])).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should append all the given elements after the current iterable elements', () => {
      let iterable = ArrayIterable.newInstance([1, 2, 3]);
      let array = [4, 5, 6];
      let result = Iterables.of(iterable).addAllArray(array).asIterable();
      assert(Arrays.fromIterable(result).asArray()).to.equal([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      let array = [1, 2, 3];
      let iterable = Iterables.of(ArrayIterable.newInstance(array)).asIterable();
      assert(Arrays.fromIterable(iterable).asArray()).to.equal(array);
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the iterable', () => {
      let array = [1, 2, 3];
      let iterator = Iterables.of(ArrayIterable.newInstance(array)).asIterator();
      assert(Arrays.fromIterator(iterator).asArray()).to.equal(array);
    });
  });

  describe('filter', () => {
    it('should filter the iterable using the given filter function', () => {
      let iterable = Iterables.of(ArrayIterable.newInstance([1, 2, 3]))
          .filter((value: number) => {
            return value % 2 === 1;
          })
          .asIterable();
      assert(Arrays.fromIterable(iterable).asArray()).to.equal([1, 3]);
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Iterables.of(ArrayIterable.newInstance([1, 2, 3, 4])).iterate(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(4, Matchers.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      Iterables.of(ArrayIterable.newInstance([1, 2, 3, 4])).iterate(mockHandler);
      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(4, Matchers.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the iterable', () => {
      let iterable = Iterables.of(ArrayIterable.newInstance([1, 2, 3]))
          .map((value: number) => {
            return value + 1;
          })
          .asIterable();
      assert(Arrays.fromIterable(iterable).asArray()).to.equal([2, 3, 4]);
    });
  });
});
