import { assert, should } from 'gs-testing/export/main';
import { BooleanParser } from './boolean-parser';


describe('parse.BooleanParser', () => {
  describe('convertBackward', () => {
    should('should parse "true" as true', () => {
      assert(BooleanParser.convertBackward('true')).to.beTrue();
    });

    should('should parse "TRUE" as true', () => {
      assert(BooleanParser.convertBackward('TRUE')).to.beTrue();
    });

    should('should parse "false" as false', () => {
      assert(BooleanParser.convertBackward('false')).to.beFalse();
    });

    should('should parse any other strings as true', () => {
      assert(BooleanParser.convertBackward('randomString')).to.beTrue();
    });

    should('should parse null as null', () => {
      assert(BooleanParser.convertBackward(null) as any).to.beNull();
    });
  });

  describe('convertTo', () => {
    should('should return true as "true"', () => {
      assert(BooleanParser.convertForward(true)).to.equal('true');
    });

    should('should return false as "false', () => {
      assert(BooleanParser.convertForward(false)).to.equal('false');
    });
  });
});
