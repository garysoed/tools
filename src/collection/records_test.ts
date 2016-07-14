import {TestBase} from '../test-base';
TestBase.setup();

import {Records} from './records';


describe('collection.Records', () => {
  describe('fromKeys', () => {
    it('should create the records correctly', () => {
      let keys = ['a', 'b', 'c'];
      let result = Records.fromKeys(keys, (key: string) => key + 'V').asRecord();
      expect(result).toEqual({'a': 'aV', 'b': 'bV', 'c': 'cV'});
    });
  });
});
