import { assert, should } from 'gs-testing/export/main';

import { SizeParser } from '../parse/size-parser';


describe('parse.SizeParser', () => {
  describe('convertBackward', () => {
    should(`return the correct object for 123pt`, () => {
      assert(SizeParser.convertBackward('123pt')).to.equal({unit: 'pt', value: 123});
    });

    should(`return the correct object for 0px`, () => {
      assert(SizeParser.convertBackward('0px')).to.equal({unit: 'px', value: 0});
    });

    should(`default unitless size to "pt"`, () => {
      assert(SizeParser.convertBackward('123')).to.equal({unit: 'pt', value: 123});
    });

    should(`return null if the string is invalid`, () => {
      assert(SizeParser.convertBackward('a123abc')).to.beNull();
    });

    should(`return null if the input is null`, () => {
      assert(SizeParser.convertBackward(null)).to.beNull();
    });
  });

  describe('convertForward', () => {
    should(`return the correct string`, () => {
      assert(SizeParser.convertForward({value: 123, unit: 'px'})).to.equal('123px');
    });

    should(`return empty string if the input is null`, () => {
      assert(SizeParser.convertForward(null)).to.equal('');
    });
  });
});
