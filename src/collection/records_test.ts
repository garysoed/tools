import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Records } from './records';


describe('collection.Records', () => {
  describe('fromKeys', () => {
    it('should create the records correctly', () => {
      const keys = ['a', 'b', 'c'];
      const result = Records.fromKeys(keys, (key: string) => `${key}V`).asRecord();
      assert(result).to.equal({'a': 'aV', 'b': 'bV', 'c': 'cV'});
    });
  });
});
