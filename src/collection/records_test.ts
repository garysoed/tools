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

  describe('fromKeys', () => {
    it('should create the records correctly', () => {
      let keys = ['a', 'b', 'c'];
      let record = Records.fromKeys(keys, (key: string) => key + 'V').data;
      expect(record).toEqual({ 'a': 'aV', 'b': 'bV', 'c': 'cV' });
    });
  });

  describe('fromMap', () => {
    it('should return the correct record', () => {
      let key = 'key';
      let value1 = 'value1';
      let value2 = 'value2';

      let map = new Map<string | number, string>();
      map.set(key, value1);
      map.set(1, value2);

      expect(Records.fromMap(map).data).toEqual({[key]: value1, '1': value2});
    });
  });
});
