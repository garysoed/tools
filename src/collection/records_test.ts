import TestBase from '../test-base';
TestBase.setup();

import Records from './records';

describe('collection.Records', () => {
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
