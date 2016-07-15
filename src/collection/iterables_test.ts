import {TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {GeneratorIterable} from './generator-iterable';
import {Iterables} from './iterables';


describe('collection.Iterables', () => {
  function toArray<T>(iterable: Iterable<T>): T[] {
    let array: T[] = [];
    Iterables.of(iterable)
        .iterate((value: T) => {
          array.push(value);
        });
    return array;
  }

  describe('addAll', () => {
    it('should append all the given elements after the current iterable elements', () => {
      let firstIterable = ArrayIterable.newInstance([1, 2, 3]);
      let secondIterable = ArrayIterable.newInstance([4, 5, 6]);
      let result = Iterables.of(firstIterable).addAll(secondIterable).asIterable();
      expect(toArray(result)).toEqual([1, 2, 3, 4, 5, 6]);
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
      expect(toArray(result)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      let array = [1, 2, 3];
      let iterable = Iterables.of(ArrayIterable.newInstance(array)).asIterable();
      expect(toArray(iterable)).toEqual(array);
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the iterable', () => {
      let array = [1, 2, 3];
      let iterator = Iterables.of(ArrayIterable.newInstance(array)).asIterator();
      let resultArray: number[] = [];

      for (let result = iterator.next(); !result.done; result = iterator.next()) {
        resultArray.push(result.value);
      }
      expect(resultArray).toEqual(array);
    });
  });

  describe('filter', () => {
    it('should filter the iterable using the given filter function', () => {
      let iterable = Iterables.of(ArrayIterable.newInstance([1, 2, 3]))
          .filter((value: number) => {
            return value % 2 === 1;
          })
          .asIterable();
      expect(toArray(iterable)).toEqual([1, 3]);
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Iterables.of(ArrayIterable.newInstance([1, 2, 3, 4])).iterate(mockHandler);

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

      Iterables.of(ArrayIterable.newInstance([1, 2, 3, 4])).iterate(mockHandler);
      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(4, jasmine.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the iterable', () => {
      let iterable = Iterables.of(ArrayIterable.newInstance([1, 2, 3]))
          .map((value: number) => {
            return value + 1;
          })
          .asIterable();
      expect(toArray(iterable)).toEqual([2, 3, 4]);
    });
  });
});
