import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BooleanParser } from '../parse/boolean-parser';


describe('parse.BooleanParser', () => {
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

    it('should parse any other strings as true', () => {
      assert(BooleanParser.parse('randomString')).to.beTrue();
    });

    it('should parse null as null', () => {
      assert(<any> BooleanParser.parse(null)).to.beNull();
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
