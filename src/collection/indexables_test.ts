import {assert, TestBase, verify, verifyNever} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Arrays} from './arrays';
import {GeneratorIterable} from './generator-iterable';
import {Indexables} from './indexables';


describe('collection.Indexables', () => {
  describe('addAll', () => {
    it('should add all the given elements', () => {
      let iterable = Indexables.of([1, 2, 3])
          .addAll(ArrayIterable.newInstance([4, 5, 6]))
          .asIterable();
      assert(Arrays.fromIterable(iterable).asArray()).to.equal([1, 2, 3, 4, 5, 6]);
    });

    it('should work with infinite iterable', () => {
      let infiniteIterable = GeneratorIterable.newInstance(() => {
        return {done: false, value: 0};
      });
      Indexables.of<number>([]).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should add all the given elements', () => {
      let resultArray = Indexables.of([1, 2, 3])
          .addAllArray([4, 5, 6])
          .asArray();
      assert(resultArray).to.equal([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      let iterable = Indexables.of([1, 2, 3]).asIterable();
      assert(Arrays.fromIterable(iterable).asArray()).to.equal([1, 2, 3]);
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the iterable', () => {
      let iterator = Indexables.of([1, 2, 3]).asIterator();
      assert(Arrays.fromIterator(iterator).asArray()).to.equal([1, 2, 3]);
    });
  });

  describe('equalsTo', () => {
    it('should return true if the indexable has the same content as the array', () => {
      assert(Indexables.of([1, 2, 3]).equalsTo([1, 2, 3])).to.beTrue();
    });

    it('should return false if the indexable has different content from the array', () => {
      assert(Indexables.of([1, 2, 3]).equalsTo([2, 3, 1])).to.beFalse();
    });

    it('should return false if the indexable has less content than the array', () => {
      assert(Indexables.of<number>([]).equalsTo([1])).to.beFalse();
    });
  });

  describe('every', () => {
    it('should return true if the filter function returns true for every element', () => {
      let filterFn = jasmine.createSpy('FilterFn').and.returnValue(true);
      let result = Indexables.of([1, 2, 3]).every(filterFn);

      assert(result).to.beTrue();
      verify(filterFn)(1, 0);
      verify(filterFn)(2, 1);
      verify(filterFn)(3, 2);
    });

    it('should return false if the filter function returns a false for one element', () => {
      let result = Indexables.of([1, 2, 3])
          .every((value: number) => {
            return value !== 2;
          });

      assert(result).to.beFalse();
    });
  });

  describe('filter', () => {
    it('should filter the indexable using the given filter function', () => {
      let result = Indexables.of([1, 2, 3])
          .filter((value: number) => {
            return value % 2 === 0;
          })
          .asArray();
      assert(result).to.equal([2]);
    });
  });

  describe('filterElement', () => {
    it('should filter the indexable using the given filter function', () => {
      let result = Indexables.of([1, 2, 3])
          .filterElement((value: number, index: number) => {
            return (value + index) % 2 === 0;
          })
          .asArray();
      assert(result).to.equal([]);
    });
  });

  describe('find', () => {
    it('should return the element if found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .find((value: number, index: number) => {
            return (value + index) % 2 === 1;
          });
      assert(result).to.equal(1);
    });

    it('should return null if the element is not found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return false;
          });
      assert(result).to.beNull();
    });
  });

  describe('findIndex', () => {
    it('should return the index if found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .findIndex((value: number, index: number) => {
            return (value + index) % 2 === 1;
          });
      assert(result).to.equal(0);
    });

    it('should return null if the element is not found', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .findIndex((value: number) => {
            return false;
          });
      assert(result).to.beNull();
    });
  });

  describe('forEach', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).forEach(mockHandler);

      verify(mockHandler)(1, 0);
      verify(mockHandler)(2, 1);
      verify(mockHandler)(3, 2);
      verify(mockHandler)(4, 3);
    });
  });

  describe('forOf', () => {
    it('should go through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).forOf(mockHandler);

      verify(mockHandler)(1, 0, jasmine.any(Function));
      verify(mockHandler)(2, 1, jasmine.any(Function));
      verify(mockHandler)(3, 2, jasmine.any(Function));
      verify(mockHandler)(4, 3, jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, index: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      Indexables.of([1, 2, 3, 4]).forOf(mockHandler);
      verify(mockHandler)(1, 0, jasmine.any(Function));
      verify(mockHandler)(2, 1, jasmine.any(Function));
      verifyNever(mockHandler)(3, 2, jasmine.any(Function));
      verifyNever(mockHandler)(4, 3, jasmine.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).iterate(mockHandler);

      verify(mockHandler)(1, jasmine.any(Function));
      verify(mockHandler)(2, jasmine.any(Function));
      verify(mockHandler)(3, jasmine.any(Function));
      verify(mockHandler)(4, jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      Indexables.of([1, 2, 3, 4]).iterate(mockHandler);
      verify(mockHandler)(1, jasmine.any(Function));
      verify(mockHandler)(2, jasmine.any(Function));
      verifyNever(mockHandler)(3, jasmine.any(Function));
      verifyNever(mockHandler)(4, jasmine.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the indexable', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .map((value: number) => {
            return value + 1;
          })
          .asArray();
      assert(result).to.equal([2, 3, 4, 5]);
    });
  });

  describe('mapElement', () => {
    it('should apply the mapping function to the indexable', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .mapElement((value: number, index: number) => {
            return value + index;
          })
          .asArray();
      assert(result).to.equal([1, 3, 5, 7]);
    });
  });

  describe('removeAll', () => {
    it('should remove all elements in the given set', () => {
      let result = Indexables.of([1, 2, 3, 4])
          .removeAll(new Set([2, 3]))
          .asArray();
      assert(result).to.equal([1, 4]);
    });
  });
});
