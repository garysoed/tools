import { assert, should } from 'gs-testing/export/main';
import { BooleanParser } from '../parse';


describe('parse.BooleanParser', () => {
  describe('parse', () => {
    should('should parse "true" as true', () => {
      assert(BooleanParser.parse('true')).to.beTrue();
    });

    should('should parse "TRUE" as true', () => {
      assert(BooleanParser.parse('TRUE')).to.beTrue();
    });

    should('should parse "false" as false', () => {
      assert(BooleanParser.parse('false')).to.beFalse();
    });

    should('should parse any other strings as true', () => {
      assert(BooleanParser.parse('randomString')).to.beTrue();
    });

    should('should parse null as null', () => {
      assert(BooleanParser.parse(null) as any).to.beNull();
    });
  });

  describe('stringify', () => {
    should('should return true as "true"', () => {
      assert(BooleanParser.stringify(true)).to.equal('true');
    });

    should('should return false as "false', () => {
      assert(BooleanParser.stringify(false)).to.equal('false');
    });
  });
});
