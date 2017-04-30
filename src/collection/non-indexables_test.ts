import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ArrayIterable } from '../collection/array-iterable';
import { GeneratorIterable } from '../collection/generator-iterable';
import { Iterables } from '../collection/iterables';
import { NonIndexables } from '../collection/non-indexables';
import { Fakes } from '../mock/fakes';


describe('collection.NonIndexables', () => {
  describe('addAll', () => {
    it('should add all the given elements', () => {
      const resultArray: number[] = [];
      NonIndexables.of([1, 2, 3])
          .addAll(ArrayIterable.newInstance([4, 5, 6]))
          .iterate((value: number) => {
            resultArray.push(value);
          });
      assert(resultArray).to.equal([1, 2, 3, 4, 5, 6]);
    });

    it('should work with infinite iterable', () => {
      const infiniteIterable = GeneratorIterable.newInstance(() => {
        return {done: false, value: 0};
      });
      NonIndexables.of<number>([]).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should add all the given elements', () => {
      const resultArray = NonIndexables.of([1, 2, 3])
          .addAllArray([4, 5, 6])
          .asArray();
      assert(resultArray).to.equal([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('anyValue', () => {
    it('should return a value in the collection', () => {
      const collection = [1, 2, 3];
      const value = NonIndexables.of(collection).anyValue();

      assert(collection).to.contain(value!);
    });

    it('should return null if the collection is empty', () => {
      assert(NonIndexables.of<number>([]).anyValue()).to.beNull();
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      const iterable = NonIndexables.of([1, 2, 3]).asIterable();
      const array: number[] = [];
      Iterables.of(iterable)
          .iterate((value: number) => {
            array.push(value);
          });
      assert(array).to.equal([1, 2, 3]);
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the iterable', () => {
      const iterator = NonIndexables.of([1, 2, 3]).asIterator();
      const array: number[] = [];
      for (let result = iterator.next(); !result.done; result = iterator.next()) {
        array.push(result.value);
      }
      assert(array).to.equal([1, 2, 3]);
    });
  });

  describe('asSet', () => {
    it('should return set with all the elements', () => {
      const set = NonIndexables.of([1, 2, 3]).asSet();

      assert(set.size).to.equal(3);
      assert(set.has(1)).to.beTrue();
      assert(set.has(2)).to.beTrue();
      assert(set.has(3)).to.beTrue();
    });
  });

  describe('diff', () => {
    it('should return the correct diff sets', () => {
      const {added, removed, same} = NonIndexables
          .of([1, 2, 3, 4, 5, 6])
          .diff(new Set([1, 3, 5, 7]));
      assert(added).to.haveElements([7]);
      assert(removed).to.haveElements([2, 4, 6]);
      assert(same).to.haveElements([1, 3, 5]);
    });
  });

  describe('filter', () => {
    it('should filter the non indexable using the given filter function', () => {
      const result = NonIndexables.of([1, 2, 3])
          .filter((value: number) => {
            return value % 2 === 0;
          })
          .asArray();
      assert(result).to.equal([2]);
    });
  });

  describe('find', () => {
    it('should return the element if found', () => {
      const result = NonIndexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return value % 2 === 0;
          });
      assert(result).to.equal(2);
    });

    it('should return null if the element is not found', () => {
      const result = NonIndexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return false;
          });
      assert(result).to.beNull();
    });
  });

  describe('forEach', () => {
    it('should go through all the elements', () => {
      const mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).forEach(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1);
      assert(mockHandler).to.haveBeenCalledWith(2);
      assert(mockHandler).to.haveBeenCalledWith(3);
      assert(mockHandler).to.haveBeenCalledWith(4);
    });
  });

  describe('forOf', () => {
    it('should go through all the elements', () => {
      const mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).forOf(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(4, Matchers.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      const mockHandler = Fakes.build(jasmine.createSpy('Handler'))
          .call((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      NonIndexables.of([1, 2, 3, 4]).forOf(mockHandler);
      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(4, Matchers.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      const mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).iterate(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(4, Matchers.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      const mockHandler = Fakes.build(jasmine.createSpy('Handler'))
          .call((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      NonIndexables.of([1, 2, 3, 4]).iterate(mockHandler);
      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(4, Matchers.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the iterable', () => {
      const result = NonIndexables.of([1, 2, 3, 4])
          .map((value: number) => {
            return value + 1;
          })
          .asArray();
      assert(result).to.equal([2, 3, 4, 5]);
    });
  });

  describe('removeAll', () => {
    it('should remove all elements in the given set', () => {
      const result = NonIndexables.of([1, 2, 3, 4])
          .removeAll(new Set([2, 3]))
          .asArray();
      assert(result).to.equal([1, 4]);
    });
  });
});
