import {TestBase} from '../test-base';
TestBase.setup();

import {FloatParser} from './float-parser';


describe('webc.FloatParser', () => {
  describe('parse', () => {
    it('should return the parsed value correctly', () => {
      expect(FloatParser.parse('1.23')).toEqual(1.23);
    });

    it('should return NaN if the input is null', () => {
      expect(FloatParser.parse(null)).toEqual(NaN);
    });
  });

  describe('stringify', () => {
    it('should return the string representation of the number', () => {
      expect(FloatParser.stringify(1.23)).toEqual('1.23');
    });
  });
});
