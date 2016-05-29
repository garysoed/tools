import TestBase from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {GeneratorIterable} from './generator-iterable';
import {Iterables} from './iterables';
import {NonIndexables} from './non-indexables';


describe('collection.NonIndexables', () => {
  describe('addAll', () => {
    it('should add all the given elements', () => {
      let resultArray = []
      NonIndexables.of([1, 2, 3])
          .addAll(ArrayIterable.newInstance([4, 5, 6]))
          .iterate((value: number) => {
            resultArray.push(value);
          });
      expect(resultArray).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should work with infinite iterable', () => {
      let infiniteIterable = GeneratorIterable.newInstance(() => {
        return {done: false, value: 0};
      });
      NonIndexables.of([]).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should add all the given elements', () => {
      let resultArray = NonIndexables.of([1, 2, 3])
          .addAllArray([4, 5, 6])
          .asArray();
      expect(resultArray).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      let iterable = NonIndexables.of([1, 2, 3]).asIterable();
      let array = [];
      Iterables.of(iterable)
          .iterate((value: number) => {
            array.push(value);
          });
      expect(array).toEqual([1, 2, 3]);
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the iterable', () => {
      let iterator = NonIndexables.of([1, 2, 3]).asIterator();
      let array = [];
      for (let result = iterator.next(); !result.done; result = iterator.next()) {
        array.push(result.value);
      }
      expect(array).toEqual([1, 2, 3]);
    });
  });

  describe('asSet', () => {
    it('should return set with all the elements', () => {
      let set = NonIndexables.of([1, 2, 3]).asSet();

      expect(set.size).toEqual(3);
      expect(set.has(1)).toEqual(true);
      expect(set.has(2)).toEqual(true);
      expect(set.has(3)).toEqual(true);
    });
  });

  describe('filter', () => {
    it('should filter the non indexable using the given filter function', () => {
      let result = NonIndexables.of([1, 2, 3])
          .filter((value: number) => {
            return value % 2 === 0;
          })
          .asArray();
      expect(result).toEqual([2]);
    });
  });

  describe('find', () => {
    it('should return the element if found', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return value % 2 === 0;
          });
      expect(result).toEqual(2);
    });

    it('should return null if the element is not found', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return false;
          });
      expect(result).toEqual(null);
    });
  });

  describe('forEach', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).forEach(mockHandler);

      expect(mockHandler).toHaveBeenCalledWith(1);
      expect(mockHandler).toHaveBeenCalledWith(2);
      expect(mockHandler).toHaveBeenCalledWith(3);
      expect(mockHandler).toHaveBeenCalledWith(4);
    });
  });

  describe('forOf', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).forOf(mockHandler);

      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(4, jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      NonIndexables.of([1, 2, 3, 4]).forOf(mockHandler);
      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(4, jasmine.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      NonIndexables.of([1, 2, 3, 4]).iterate(mockHandler);

      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(4, jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      NonIndexables.of([1, 2, 3, 4]).iterate(mockHandler);
      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(4, jasmine.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the iterable', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .map((value: number) => {
            return value + 1;
          })
          .asArray();
      expect(result).toEqual([2, 3, 4, 5]);
    });
  });

  describe('removeAll', () => {
    it('should remove all elements in the given set', () => {
      let result = NonIndexables.of([1, 2, 3, 4])
          .removeAll(new Set([2, 3]))
          .asArray();
      expect(result).toEqual([1, 4]);
    });
  });
});
