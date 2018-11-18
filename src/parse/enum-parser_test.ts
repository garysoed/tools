import { assert, should } from 'gs-testing/export/main';
import { EnumParser, EnumParserImpl } from '../parse/enum-parser';

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
    should('return the correct enum', () => {
      assert(parser.convertBackward('a')).to.equal(Enum.A);
    });

    should('return null if the enum is invalid', () => {
      assert(parser.convertBackward('non_existent')).to.beNull();
    });

    should('return null if the input is null', () => {
      assert(parser.convertBackward(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    should('return the correct string', () => {
      assert(parser.convertForward(Enum.A)).to.equal('a');
    });
  });
});
