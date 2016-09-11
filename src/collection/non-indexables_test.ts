import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {GeneratorIterable} from './generator-iterable';
import {Iterables} from './iterables';
import {NonIndexables} from './non-indexables';


describe('collection.NonIndexables', () => {
  describe('addAll', () => {
    it('should add all the given elements', () => {
      let resultArray: number[] = [];
      NonIndexables.of([1, 2, 3])
          .addAll(ArrayIterable.newInstance([4, 5, 6]))
          .iterate((value: number) => {
            resultArray.push(value);
          });
      assert(resultArray).to.equal([1, 2, 3, 4, 5, 6]);
    });

    it('should work with infinite iterable', () => {
      let infiniteIterable = GeneratorIterable.newInstance(() => {
        return {done: false, value: 0};
      });
      NonIndexables.of<number>([]).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should add all the given elements', () => {
      let resultArray = NonIndexables.of([1, 2, 3])
          .addAllArray([4, 5, 6])
          .asArray();
      assert(resultArray).to.equal([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      let iterable = NonIndexables.of([1, 2, 3]).asIterable();
      let array: number[] = [];
      Iterables.of(iterable)
          .iterate((value: number) => {
            array.push(value);
          });
      assert(array).to.equal([1, 2, 3]);
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the iterable', () => {
      let iterator = NonIndexables.of([1, 2, 3]).asIterator();
      let array: number[] = [];
      for (let result = iterator.next(); !result.done; result = iterator.next()) {
        array.push(result.value);
      }
      assert(array).to.equal([1, 2, 3]);
    });
  });

  describe('asSet', () => {
    it('should return set with all the elements', () => {
      let set = NonIndexables.of([1, 2, 3]).asSet();

      assert(set.size).to.equal(3);
      assert(set.has(1)).to.beTrue();
      assert(set.has(2)).to.beTrue();
      assert(set.has(3)).to.beTrue();
    });
  });

  describe('filter', () => {
    it('should filter the non indexable using the given filter function', () => {
      let result = NonIndexables.of([1, 2, 3])
          .filter((value: number) => {
            return value % 2 === 0;
          })
          .asArray();
      assert(result).to.equal([2]);
    });
  });

  describe('find', () => {
    it('should return the element if found', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return value % 2 === 0;
          });
      assert(result).to.equal(2);
    });

    it('should return null if the element is not found', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return false;
          });
      assert(result).to.beNull();
    });
  });

  describe('forEach', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).forEach(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1);
      assert(mockHandler).to.haveBeenCalledWith(2);
      assert(mockHandler).to.haveBeenCalledWith(3);
      assert(mockHandler).to.haveBeenCalledWith(4);
    });
  });

  describe('forOf', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).forOf(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(3, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(4, jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      NonIndexables.of([1, 2, 3, 4]).forOf(mockHandler);
      assert(mockHandler).to.haveBeenCalledWith(1, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, jasmine.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(3, jasmine.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(4, jasmine.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).iterate(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(3, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(4, jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      NonIndexables.of([1, 2, 3, 4]).iterate(mockHandler);
      assert(mockHandler).to.haveBeenCalledWith(1, jasmine.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, jasmine.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(3, jasmine.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(4, jasmine.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the iterable', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .map((value: number) => {
            return value + 1;
          })
          .asArray();
      assert(result).to.equal([2, 3, 4, 5]);
    });
  });

  describe('removeAll', () => {
    it('should remove all elements in the given set', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .removeAll(new Set([2, 3]))
          .asArray();
      assert(result).to.equal([1, 4]);
    });
  });
});
