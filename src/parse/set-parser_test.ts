import { assert, should } from 'gs-testing/export/main';

import { ImmutableSet } from '../immutable/immutable-set';
import { SetParser, SetParserImpl } from '../parse/set-parser';
import { StringParser } from '../parse/string-parser';


describe('parse.SetParser', () => {
  let parser: SetParserImpl<string>;

  beforeEach(() => {
    parser = SetParser<string>(StringParser);
  });

  describe('convertBackward', () => {
    should('parse correctly', () => {
      const item1 = 'item1';
      const item2 = 'item2';
      // tslint:disable-next-line:no-non-null-assertion
      assert(parser.convertBackward(`["${item1}","${item2}"]`)!).to.haveElements([item1, item2]);
    });

    should('return null if the input is null', () => {
      assert(parser.convertBackward(null)).to.beNull();
    });
  });

  describe('convertForward', () => {
    should('stringify correctly', () => {
      const item1 = 'item1';
      const item2 = 'item2';
      assert(parser.convertForward(ImmutableSet.of([item1, item2])))
          .to.equal(`["${item1}","${item2}"]`);
    });

    should('return empty string if value is null', () => {
      assert(parser.convertForward(null)).to.equal('');
    });
  });
});
