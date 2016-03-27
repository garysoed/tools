import TestBase from '../test-base';
TestBase.setup();

import Maps from './maps';
import Records from './records';

describe('collection.Records', () => {
  describe('addAll', () => {
    it('should add all the values in the given map and override exisitng ones', () => {
      let record = <{ [key: string]: number }>  {
        existing: 1,
        overridden: 2,
      };

      let newRecord = <{ [key: string]: number }> {
        newValue: 3,
        overridden: 4,
      };

      expect(Records.of(record).addAll(Maps.fromRecord(newRecord).data).data).toEqual({
        existing: 1,
        newValue: 3,
        overridden: 4,
      });
    });
  });

  describe('filter', () => {
    it('should remove entries that are filtered out', () => {
      let record = <{ [key: string]: number }> {
        a: 1,
        b: 2,
        c: 3,
      };
      expect(Records.of(record).filter((value: number) => value % 2 !== 0).data)
          .toEqual({ a: 1, c: 3 });
    });
  });

  describe('forEach', () => {
    it('should call the function for every element in the record', () => {
      let record = <{ [key: string]: string }> {
        a: 'a',
        b: 'b',
      };
      let callback = jasmine.createSpy('Callback');
      Records.of(record).forEach(callback);
      expect(callback).toHaveBeenCalledWith('a', 'a');
      expect(callback).toHaveBeenCalledWith('b', 'b');
    });
  });

  describe('mapValue', () => {
    it('should map the values of the given array', () => {
      let record = <{ [key: string]: string }> {
        a: 'a',
        b: 'b',
      };
      let out = Records.of(record).mapValue((value: string) => `${value}_`).data;
      expect(out).toEqual({ 'a': 'a_', 'b': 'b_' });
    });
  });
});
