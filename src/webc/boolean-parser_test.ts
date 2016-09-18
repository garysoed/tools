import {assert, TestBase} from '../test-base';
TestBase.setup();

import {BooleanParser} from './boolean-parser';


describe('webc.BooleanParser', () => {
  describe('parse', () => {
    it('should parse "true" as true', () => {
      assert(BooleanParser.parse('true')).to.beTrue();
    });

    it('should parse "TRUE" as true', () => {
      assert(BooleanParser.parse('TRUE')).to.beTrue();
    });

    it('should parse "false" as false', () => {
      assert(BooleanParser.parse('false')).to.beFalse();
    });

    it('should parse any other strings as false', () => {
      assert(BooleanParser.parse('randomString')).to.beFalse();
    });

    it('should parse null as false', () => {
      assert(BooleanParser.parse(null)).to.beFalse();
    });
  });

  describe('stringify', () => {
    it('should return true as "true"', () => {
      assert(BooleanParser.stringify(true)).to.equal('true');
    });

    it('should return false as "false', () => {
      assert(BooleanParser.stringify(false)).to.equal('false');
    });
  });
});
