import { assert, should } from 'gs-testing/export/main';

import { FloatParser } from '../parse/float-parser';


describe('parse.FloatParser', () => {
  describe('parse', () => {
    should('return the parsed value correctly', () => {
      assert(FloatParser.convertBackward('1.23')).to.equal(1.23);
    });

    should('return null if the input is null', () => {
      assert(FloatParser.convertBackward(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    should('return the string representation of the number', () => {
      assert(FloatParser.convertForward(1.23)).to.equal('1.23');
    });

    should('return empty string if the input is null', () => {
      assert(FloatParser.convertForward(null)).to.equal('');
    });
  });
});
