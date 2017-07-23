import { EnumParser } from '../parse';
import { EnumParserImpl } from '../parse/enum-parser';
import { assert, TestBase } from '../test-base';

TestBase.setup();

enum Enum {
  A,
  B,
}

describe('parse.EnumParser', () => {
  let parser: EnumParserImpl<Enum>;

  beforeEach(() => {
    parser = EnumParser<Enum>(Enum);
  });

  describe('parse', () => {
    it('should return the correct enum', () => {
      assert(parser.parse('a')).to.equal(Enum.A);
    });

    it('should return null if the enum is invalid', () => {
      assert(parser.parse('non_existent')).to.beNull();
    });

    it('should return null if the input is null', () => {
      assert(parser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it('should return the correct string', () => {
      assert(parser.stringify(Enum.A)).to.equal('a');
    });
  });
});
