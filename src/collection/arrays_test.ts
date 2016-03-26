import TestBase from '../test-base';
TestBase.setup();

import Arrays from './arrays';

describe('collection.Arrays', () => {
  describe('diff', () => {
    it('should remove all elements in the given array', () => {
      let toRemove = [2, 4, 6];
      expect(Arrays.of([1, 2, 3]).diff(toRemove).data).toEqual([1, 3]);
    });
  });

  describe('forOf', () => {
    it('should call the callback with the correct arguments', () => {
      let callback = jasmine.createSpy('Callback').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });

      Arrays.of([1, 2, 3]).forOf(callback);
      expect(callback).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(callback).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(callback).not.toHaveBeenCalledWith(3, jasmine.any(Function));
    });
  });

  describe('fromIterable', () => {
    it('should return the correct array', () => {
      let array = [1, 2, 3, 4];
      expect(Arrays.fromIterable(array).data).toEqual(array);
    });
  });

  describe('fromNumericalIndexed', () => {
    it('should return the correct array', () => {
      let indexed = <{ [index: number]: string, length: number }> {
        0: 'a',
        1: 'b',
        2: 'c',
        length: 3,
      };

      expect(Arrays.fromNumericalIndexed(indexed).data).toEqual(['a', 'b', 'c']);
    });
  });

  describe('fromRecordKeys', () => {
    it('should return the correct array', () => {
      let record = { a: 1, b: 2 };
      expect(Arrays.fromRecordKeys(record).data).toEqual(['a', 'b']);
    });
  });

  describe('fromRecordValues', () => {
    it('should return the correct array', () => {
      let record = <{ [index: string]: number }> { a: 1, b: 2 };
      expect(Arrays.fromRecordValues(record).data).toEqual([1, 2]);
    });
  });
});
