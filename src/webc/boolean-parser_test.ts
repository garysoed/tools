import {TestBase} from '../test-base';
TestBase.setup();

import {BooleanParser} from './boolean-parser';


describe('webc.BooleanParser', () => {
  describe('parse', () => {
    it('should parse "true" as true', () => {
      expect(BooleanParser.parse('true')).toEqual(true);
    });

    it('should parse "TRUE" as true', () => {
      expect(BooleanParser.parse('TRUE')).toEqual(true);
    });

    it('should parse "false" as false', () => {
      expect(BooleanParser.parse('false')).toEqual(false);
    });

    it('should parse any other strings as false', () => {
      expect(BooleanParser.parse('randomString')).toEqual(false);
    });

    it('should parse null as false', () => {
      expect(BooleanParser.parse(null)).toEqual(false);
    });
  });

  describe('stringify', () => {
    it('should return true as "true"', () => {
      expect(BooleanParser.stringify(true)).toEqual('true');
    });

    it('should return false as "false', () => {
      expect(BooleanParser.stringify(false)).toEqual('false');
    });
  });
});
