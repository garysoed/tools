import { assert, should } from 'gs-testing/export/main';

import { StringSetParser } from '../parse/string-set-parser';


describe('parse.StringSetParser', () => {
  describe('convertBackward', () => {
    should(`return the string if it is in the set`, () => {
      assert(StringSetParser(['a', 'b']).convertBackward('a')).to.equal('a');
    });

    should(`return null if the string is not in the set`, () => {
      assert(StringSetParser(['a', 'b']).convertBackward('c')).to.beNull();
    });
  });

  describe('convertForward', () => {
    should(`return the string`, () => {
      assert(StringSetParser(['a', 'b']).convertForward('a')).to.equal('a');
    });
  });
});
