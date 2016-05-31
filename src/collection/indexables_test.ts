import TestBase from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {GeneratorIterable} from './generator-iterable';
import {Indexables} from './indexables';
import {Iterables} from './iterables';


describe('collection.Indexables', () => {
  describe('addAll', () => {
    it('should add all the given elements', () => {
      let resultArray = []
      Indexables.of([1, 2, 3])
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
      Indexables.of([]).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should add all the given elements', () => {
      let resultArray = Indexables.of([1, 2, 3])
          .addAllArray([4, 5, 6])
          .asArray();
      expect(resultArray).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      let iterable = Indexables.of([1, 2, 3]).asIterable();
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
      let iterator = Indexables.of([1, 2, 3]).asIterator();
      let array = [];
      for (let result = iterator.next(); !result.done; result = iterator.next()) {
        array.push(result.value);
      }
      expect(array).toEqual([1, 2, 3]);
    });
  });

  describe('every', () => {
    it('should return true if the filter function returns true for every element', () => {
      let filterFn = jasmine.createSpy('FilterFn').and.returnValue(true);
      let result = Indexables.of([1, 2, 3]).every(filterFn);

      expect(result).toEqual(true);
      expect(filterFn).toHaveBeenCalledWith(1, 0);
      expect(filterFn).toHaveBeenCalledWith(2, 1);
      expect(filterFn).toHaveBeenCalledWith(3, 2);
    });

    it('should return false if the filter function returns a false for one element', () => {
      let result = Indexables.of([1, 2, 3])
          .every((value: number) => {
            return value !== 2;
          });

      expect(result).toEqual(false);
    });
  });

  describe('filter', () => {
    it('should filter the indexable using the given filter function', () => {
      let result = Indexables.of([1, 2, 3])
          .filter((value: number) => {
            return value % 2 === 0;
          })
          .asArray();
      expect(result).toEqual([2]);
    });
  });

  describe('filterElement', () => {
    it('should filter the indexable using the given filter function', () => {
      let result = Indexables.of([1, 2, 3])
          .filterElement((value: number, index: number) => {
            return (value + index) % 2 === 0;
          })
          .asArray();
      expect(result).toEqual([]);
    });
  });

  describe('find', () => {
    it('should return the element if found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .find((value: number, index: number) => {
            return (value + index) % 2 === 1;
          });
      expect(result).toEqual(1);
    });

    it('should return null if the element is not found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return false;
          });
      expect(result).toEqual(null);
    });
  });

  describe('findIndex', () => {
    it('should return the index if found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .findIndex((value: number, index: number) => {
            return (value + index) % 2 === 1;
          });
      expect(result).toEqual(0);
    });

    it('should return null if the element is not found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .findIndex((value: number) => {
            return false;
          });
      expect(result).toEqual(null);
    });
  });

  describe('forEach', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).forEach(mockHandler);

      expect(mockHandler).toHaveBeenCalledWith(1, 0);
      expect(mockHandler).toHaveBeenCalledWith(2, 1);
      expect(mockHandler).toHaveBeenCalledWith(3, 2);
      expect(mockHandler).toHaveBeenCalledWith(4, 3);
    });
  });

  describe('forOf', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).forOf(mockHandler);

      expect(mockHandler).toHaveBeenCalledWith(1, 0, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, 1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(3, 2, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(4, 3, jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, index: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      Indexables.of([1, 2, 3, 4]).forOf(mockHandler);
      expect(mockHandler).toHaveBeenCalledWith(1, 0, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, 1, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(3, 2, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(4, 3, jasmine.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).iterate(mockHandler);

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

      Indexables.of([1, 2, 3, 4]).iterate(mockHandler);
      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(4, jasmine.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the indexable', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .map((value: number) => {
            return value + 1;
          })
          .asArray();
      expect(result).toEqual([2, 3, 4, 5]);
    });
  });

  describe('mapElement', () => {
    it('should apply the mapping function to the indexable', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .mapElement((value: number, index: number) => {
            return value + index;
          })
          .asArray();
      expect(result).toEqual([1, 3, 5, 7]);
    });
  });

  describe('removeAll', () => {
    it('should remove all elements in the given set', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .removeAll(new Set([2, 3]))
          .asArray();
      expect(result).toEqual([1, 4]);
    });
  });
});
