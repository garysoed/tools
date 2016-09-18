import {assert, TestBase} from '../test-base';
TestBase.setup();

import {FloatParser} from './float-parser';


describe('webc.FloatParser', () => {
  describe('parse', () => {
    it('should return the parsed value correctly', () => {
      assert(FloatParser.parse('1.23')).to.equal(1.23);
    });

    it('should return NaN if the input is null', () => {
      assert(FloatParser.parse(null)).to.equal(NaN);
    });
  });

  describe('stringify', () => {
    it('should return the string representation of the number', () => {
      assert(FloatParser.stringify(1.23)).to.equal('1.23');
    });
  });
});
