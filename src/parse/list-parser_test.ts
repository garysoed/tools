import { assert, should } from 'gs-testing/export/main';

import { ImmutableList } from '../immutable/immutable-list';
import { ListParser, ListParserImpl } from '../parse/list-parser';
import { StringParser } from '../parse/string-parser';


describe('parse.ListParser', () => {
  let parser: ListParserImpl<string>;

  beforeEach(() => {
    parser = ListParser<string>(StringParser);
  });

  describe('parse', () => {
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

  describe('stringify', () => {
    should('stringify correctly', () => {
      const item1 = 'item1';
      const item2 = 'item2';
      assert(parser.convertForward(ImmutableList.of([item1, item2])))
          .to.equal(`["${item1}","${item2}"]`);
    });

    should('return empty string if value is null', () => {
      assert(parser.convertForward(null)).to.equal('');
    });
  });
});
