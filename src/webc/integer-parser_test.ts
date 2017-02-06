import {assert, TestBase} from '../test-base';
TestBase.setup();

import {IntegerParser} from './integer-parser';


describe('webc.IntegerParser', () => {
  describe('parse', () => {
    it('should parse the input string correctly', () => {
      assert(IntegerParser.parse('123')).to.equal(123);
    });

    it('should round the number', () => {
      assert(IntegerParser.parse('1.23')).to.equal(1);
    });

    it('should return null if the string cannot be parsed', () => {
      assert(IntegerParser.parse('')).to.beNull();
    });
  });

  describe('stringify', () => {
    it('should stringify the number correctly', () => {
      assert(IntegerParser.stringify(123)).to.equal('123');
    });

    it('should round the number', () => {
      assert(IntegerParser.stringify(1.23)).to.equal('1');
    });
  });
});
