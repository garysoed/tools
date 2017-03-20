import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ArrayParser, ArrayParserImpl, DELIMITER_ } from './array-parser';
import { StringParser } from './string-parser';


describe('webc.ArrayParser', () => {
  let parser: ArrayParserImpl<string>;

  beforeEach(() => {
    parser = ArrayParser(StringParser);
  });

  describe('parse', () => {
    it('should parse correctly', () => {
      let item1 = 'item1';
      let item2 = 'item2';
      assert(parser.parse(`${item1}${DELIMITER_}${item2}`)).to.equal([item1, item2]);
    });

    it('should return null if the input is null', () => {
      assert(parser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it('should stringify correctly', () => {
      let item1 = 'item1';
      let item2 = 'item2';
      assert(parser.stringify([item1, item2])).to.equal(`${item1}${DELIMITER_}${item2}`);
    });

    it('should return empty string if value is null', () => {
      assert(parser.stringify(null)).to.equal('');
    });
  });
});
