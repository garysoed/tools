import { assert, should } from 'gs-testing/export/main';

import { HexParser } from '../parse/hex-parser';


describe('parse.HexParser', () => {
  describe('parse', () => {
    should('return the parsed value correctly', () => {
      assert(HexParser.convertBackward('ab')).to.equal(0xAB);
    });

    should('return null if the value is invalid hex', () => {
      assert(HexParser.convertBackward('hg')).to.beNull();
    });

    should('return null if the input is null', () => {
      assert(HexParser.convertBackward(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    should('return the string representation of the number', () => {
      assert(HexParser.convertForward(0xBEEF)).to.equal('beef');
    });

    should('return empty string if the input is null', () => {
      assert(HexParser.convertForward(null)).to.equal('');
    });
  });
});
