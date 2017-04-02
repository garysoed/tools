import { assert, TestBase } from '../test-base';
TestBase.setup();

import { HexParser } from '../parse/hex-parser';


describe('parse.HexParser', () => {
  describe('parse', () => {
    it('should return the parsed value correctly', () => {
      assert(HexParser.parse('ab')).to.equal(0xab);
    });

    it('should return null if the value is invalid hex', () => {
      assert(HexParser.parse('hg')).to.beNull();
    });

    it('should return null if the input is null', () => {
      assert(HexParser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it('should return the string representation of the number', () => {
      assert(HexParser.stringify(0xbeef)).to.equal('beef');
    });

    it('should return empty string if the input is null', () => {
      assert(HexParser.stringify(null)).to.equal('');
    });
  });
});
