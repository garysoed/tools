import { assert, TestBase } from '../test-base';
TestBase.setup();

2import { ImmutableSet } from '../immutable/immutable-set';
import { DELIMITER_ } from '../parse/list-parser';
import { SetParser, SetParserImpl } from '../parse/set-parser';
import { StringParser } from '../parse/string-parser';


describe('parse.ListParser', () => {
  let parser: SetParserImpl<string>;

  beforeEach(() => {
    parser = SetParser<string>(StringParser);
  });

  describe('parse', () => {
    it('should parse correctly', () => {
      const item1 = 'item1';
      const item2 = 'item2';
      assert(parser.parse(`${item1}${DELIMITER_}${item2}`)!).to.haveElements([item1, item2]);
    });

    it('should return null if the input is null', () => {
      assert(parser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it('should stringify correctly', () => {
      const item1 = 'item1';
      const item2 = 'item2';
      assert(parser.stringify(ImmutableSet.of([item1, item2])))
          .to.equal(`${item1}${DELIMITER_}${item2}`);
    });

    it('should return empty string if value is null', () => {
      assert(parser.stringify(null)).to.equal('');
    });
  });
});
