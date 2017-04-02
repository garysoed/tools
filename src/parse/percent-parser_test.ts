import { assert, TestBase } from '../test-base';
TestBase.setup();

import { PercentParser } from '../parse/percent-parser';


describe('parse.PercentParser', () => {
  describe('parse', () => {
    it('should return the parsed value correctly', () => {
      assert(PercentParser.parse('123.45%')).to.equal(1.2345);
    });

    it('should return null if the value is invalid number', () => {
      assert(PercentParser.parse('abc%')).to.beNull();
    });

    it('should return null if the value does not end with %', () => {
      assert(PercentParser.parse('123')).to.beNull();
    });

    it('should return null if the input is null', () => {
      assert(PercentParser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it('should return the string representation of the number', () => {
      assert(PercentParser.stringify(0.345)).to.equal('34.5%');
    });

    it('should return empty string if the input is null', () => {
      assert(PercentParser.stringify(null)).to.equal('');
    });
  });
});
