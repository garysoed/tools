import { assert, TestBase } from '../test-base';
TestBase.setup();

import { StringSetParser } from '../parse/string-set-parser';


describe('parse.StringSetParser', () => {
  describe('parse', () => {
    it(`should return the string if it is in the set`, () => {
      assert(StringSetParser(['a', 'b']).parse('a')).to.equal('a');
    });

    it(`should return null if the string is not in the set`, () => {
      assert(StringSetParser(['a', 'b']).parse('c')).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should return the string`, () => {
      assert(StringSetParser(['a', 'b']).stringify('a')).to.equal('a');
    });
  });
});
