import TestBase from '../test-base';
TestBase.setup();

import Records from './records';

describe('collection.Records', () => {
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

  describe('map', () => {
    it('should return array of mapped values', () => {
      let record = <{ [key: string]: string }> {
        a: 'a',
        b: 'b',
      };
      expect(Records.of(record)
          .map((value: string, key: string) => value + key)
          .data).toEqual(['aa', 'bb']);
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

  describe('toMap', () => {
    it('should return the correct fluent map', () => {
      let record = <{ [key: string]: string }> {
        a: 'a',
        b: 'b',
      };

      let expectedMap = new Map<string, string>();
      expectedMap.set('a', 'a');
      expectedMap.set('b', 'b');
      expect(Records.of(record).toMap().data).toEqual(expectedMap);
    });
  });
});
