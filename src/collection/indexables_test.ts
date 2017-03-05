import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ArrayIterable } from '../collection/array-iterable';
import { Arrays } from '../collection/arrays';
import { GeneratorIterable } from '../collection/generator-iterable';
import { Indexables } from '../collection/indexables';


describe('collection.Indexables', () => {
  describe('addAll', () => {
    it('should add all the given elements', () => {
      const iterable = Indexables.of([1, 2, 3])
          .addAll(ArrayIterable.newInstance([4, 5, 6]))
          .asIterable();
      assert(Arrays.fromIterable(iterable).asArray()).to.equal([1, 2, 3, 4, 5, 6]);
    });

    it('should work with infinite iterable', () => {
      const infiniteIterable = GeneratorIterable.newInstance(() => {
        return {done: false, value: 0};
      });
      Indexables.of<number>([]).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should add all the given elements', () => {
      const resultArray = Indexables.of([1, 2, 3])
          .addAllArray([4, 5, 6])
          .asArray();
      assert(resultArray).to.equal([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      const iterable = Indexables.of([1, 2, 3]).asIterable();
      assert(Arrays.fromIterable(iterable).asArray()).to.equal([1, 2, 3]);
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the iterable', () => {
      const iterator = Indexables.of([1, 2, 3]).asIterator();
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
      const filterFn = jasmine.createSpy('FilterFn').and.returnValue(true);
      const result = Indexables.of([1, 2, 3]).every(filterFn);

      assert(result).to.beTrue();
      assert(filterFn).to.haveBeenCalledWith(1, 0);
      assert(filterFn).to.haveBeenCalledWith(2, 1);
      assert(filterFn).to.haveBeenCalledWith(3, 2);
    });

    it('should return false if the filter function returns a false for one element', () => {
      const result = Indexables.of([1, 2, 3])
          .every((value: number) => {
            return value !== 2;
          });

      assert(result).to.beFalse();
    });
  });

  describe('filter', () => {
    it('should filter the indexable using the given filter function', () => {
      const result = Indexables.of([1, 2, 3])
          .filter((value: number) => {
            return value % 2 === 0;
          })
          .asArray();
      assert(result).to.equal([2]);
    });
  });

  describe('filterElement', () => {
    it('should filter the indexable using the given filter function', () => {
      const result = Indexables.of([1, 2, 3])
          .filterElement((value: number, index: number) => {
            return (value + index) % 2 === 0;
          })
          .asArray();
      assert(result).to.equal([]);
    });
  });

  describe('find', () => {
    it('should return the element if found', () => {
      const result = Indexables.of([1, 2, 3, 4])
          .find((value: number, index: number) => {
            return (value + index) % 2 === 1;
          });
      assert(result).to.equal(1);
    });

    it('should return null if the element is not found', () => {
      const result = Indexables.of([1, 2, 3, 4])
          .find((value: number) => {
            return false;
          });
      assert(result).to.beNull();
    });
  });

  describe('findIndex', () => {
    it('should return the index if found', () => {
      const result = Indexables.of([1, 2, 3, 4])
          .findIndex((value: number, index: number) => {
            return (value + index) % 2 === 1;
          });
      assert(result).to.equal(0);
    });

    it('should return null if the element is not found', () => {
      const result = Indexables.of([1, 2, 3, 4])
          .findIndex((value: number) => {
            return false;
          });
      assert(result).to.beNull();
    });
  });

  describe('forEach', () => {
    it('should go through all the elements', () => {
      const mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).forEach(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, 0);
      assert(mockHandler).to.haveBeenCalledWith(2, 1);
      assert(mockHandler).to.haveBeenCalledWith(3, 2);
      assert(mockHandler).to.haveBeenCalledWith(4, 3);
    });
  });

  describe('forOf', () => {
    it('should go through all the elements', () => {
      const mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).forOf(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, 0, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, 1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(3, 2, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(4, 3, Matchers.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      const mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, index: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      Indexables.of([1, 2, 3, 4]).forOf(mockHandler);
      assert(mockHandler).to.haveBeenCalledWith(1, 0, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, 1, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(3, 2, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(4, 3, Matchers.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through all the elements', () => {
      const mockHandler = jasmine.createSpy('Handler');
      Indexables.of([1, 2, 3, 4]).iterate(mockHandler);

      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(4, Matchers.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      const mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      Indexables.of([1, 2, 3, 4]).iterate(mockHandler);
      assert(mockHandler).to.haveBeenCalledWith(1, Matchers.any(Function));
      assert(mockHandler).to.haveBeenCalledWith(2, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(3, Matchers.any(Function));
      assert(mockHandler).toNot.haveBeenCalledWith(4, Matchers.any(Function));
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the indexable', () => {
      const result = Indexables.of([1, 2, 3, 4])
          .map((value: number) => {
            return value + 1;
          })
          .asArray();
      assert(result).to.equal([2, 3, 4, 5]);
    });
  });

  describe('mapElement', () => {
    it('should apply the mapping function to the indexable', () => {
      const result = Indexables.of([1, 2, 3, 4])
          .mapElement((value: number, index: number) => {
            return value + index;
          })
          .asArray();
      assert(result).to.equal([1, 3, 5, 7]);
    });
  });

  describe('reduce', () => {
    it('should reduce correctly', () => {
      const result = Indexables
          .of(['a', 'b', 'c', 'd'])
          .reduce<string>(
              (value: string, index: number, previousResult: string) => {
                return `${previousResult};${value}${index}`;
              },
              '^');
      assert(result).to.equal('^;a0;b1;c2;d3');
    });
  });

  describe('removeAll', () => {
    it('should remove all elements in the given set', () => {
      const result = Indexables.of([1, 2, 3, 4])
          .removeAll(new Set([2, 3]))
          .asArray();
      assert(result).to.equal([1, 4]);
    });
  });
});
