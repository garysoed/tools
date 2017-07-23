import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableMap } from '../immutable/immutable-map';
import { Parser } from '../interfaces/parser';
import { FloatParser } from '../parse/float-parser';
import { MapParser } from '../parse/map-parser';
import { StringParser } from '../parse/string-parser';


describe('parse.MapParser', () => {
  let parser: Parser<ImmutableMap<string, number | null>>;

  beforeEach(() => {
    parser = MapParser<string, number>(StringParser, FloatParser);
  });

  describe('parse', () => {
    it('should parse correctly', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const item1 = 12;
      const item2 = 34;
      assert(parser.parse(`["[\\"${key1}\\",\\"${item1}\\"]","[\\"${key2}\\",\\"${item2}\\"]"]`)!)
          .to.haveElements([[key1, item1], [key2, item2]]);
    });

    it('should return null if the input is null', () => {
      assert(parser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it('should stringify correctly', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const item1 = 12;
      const item2 = 34;
      assert(parser.stringify(ImmutableMap.of([[key1, item1], [key2, item2]])))
          .to.equal(`["[\\"${key1}\\",\\"${item1}\\"]","[\\"${key2}\\",\\"${item2}\\"]"]`);
    });

    it('should return empty string if value is null', () => {
      assert(parser.stringify(null)).to.equal('');
    });
  });
});
