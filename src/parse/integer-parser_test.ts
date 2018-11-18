import { assert, should } from 'gs-testing/export/main';

import { IntegerParser } from '../parse/integer-parser';


describe('parse.IntegerParser', () => {
  describe('parse', () => {
    should('parse the input string correctly', () => {
      assert(IntegerParser.convertBackward('123')).to.equal(123);
    });

    should('round the number', () => {
      assert(IntegerParser.convertBackward('1.23')).to.equal(1);
    });

    should('return null if the string cannot be parsed', () => {
      assert(IntegerParser.convertBackward('')).to.beNull();
    });
  });

  describe('stringify', () => {
    should('stringify the number correctly', () => {
      assert(IntegerParser.convertForward(123)).to.equal('123');
    });

    should('round the number', () => {
      assert(IntegerParser.convertForward(1.23)).to.equal('1');
    });
  });
});
