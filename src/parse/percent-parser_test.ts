import { assert, should } from 'gs-testing/export/main';

import { PercentParser } from '../parse/percent-parser';


describe('parse.PercentParser', () => {
  describe('convertBackward', () => {
    should('return the parsed value correctly', () => {
      assert(PercentParser.convertBackward('123.45%')).to.equal(1.2345);
    });

    should('return null if the value is invalid number', () => {
      assert(PercentParser.convertBackward('abc%')).to.beNull();
    });

    should('return null if the value does not end with %', () => {
      assert(PercentParser.convertBackward('123')).to.beNull();
    });

    should('return null if the input is null', () => {
      assert(PercentParser.convertBackward(null)).to.beNull();
    });
  });

  describe('convertForward', () => {
    should('return the string representation of the number', () => {
      assert(PercentParser.convertForward(0.345)).to.equal('34.5%');
    });

    should('return empty string if the input is null', () => {
      assert(PercentParser.convertForward(null)).to.equal('');
    });
  });
});
