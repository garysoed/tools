import { assert, should } from 'gs-testing/export/main';

import { ImmutableMap } from '../immutable/immutable-map';
import { FloatParser } from '../parse/float-parser';
import { MapParser } from '../parse/map-parser';
import { StringParser } from '../parse/string-parser';
import { Parser } from './parser';


describe('parse.MapParser', () => {
  let parser: Parser<ImmutableMap<string, number | null>>;

  beforeEach(() => {
    parser = MapParser<string, number>(StringParser, FloatParser);
  });

  describe('backward', () => {
    should('parse correctly', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const item1 = 12;
      const item2 = 34;
      const stringValue = `["[\\"${key1}\\",\\"${item1}\\"]","[\\"${key2}\\",\\"${item2}\\"]"]`;
      // tslint:disable-next-line:no-non-null-assertion
      assert(parser.convertBackward(stringValue)!)
          .to.haveElements([[key1, item1], [key2, item2]]);
    });

    should('return null if the input is null', () => {
      assert(parser.convertBackward(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    should('stringify correctly', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const item1 = 12;
      const item2 = 34;
      assert(parser.convertForward(ImmutableMap.of([[key1, item1], [key2, item2]])))
          .to.equal(`["[\\"${key1}\\",\\"${item1}\\"]","[\\"${key2}\\",\\"${item2}\\"]"]`);
    });

    should('return empty string if value is null', () => {
      assert(parser.convertForward(null)).to.equal('');
    });
  });
});
