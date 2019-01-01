import { assert, should } from 'gs-testing/export/main';
import { integerConverter } from './integer-converter';


describe('serializer.IntegerConverter', () => {
  describe('convertBackward', () => {
    should('convert the number', () => {
      assert(integerConverter().convertBackward(123)).to.haveProperties({result: 123});
    });

    should('round the number', () => {
      assert(integerConverter().convertBackward(1.23)).to.haveProperties({result: 1});
    });

    should('fail if the not rounded and rounding is disabled', () => {
      assert(integerConverter(false).convertBackward(1.23)).to.haveProperties({success: false});
    });

    should('fail if the input is not a number', () => {
      assert(integerConverter().convertBackward('')).to.haveProperties({success: false});
    });
  });

  describe('convertForward', () => {
    should('return the value', () => {
      assert(integerConverter().convertForward(123)).to.haveProperties({result: 123});
    });

    should(`fail if not an integer`, () => {
      assert(integerConverter().convertForward(123.456)).to.haveProperties({success: false});
    });
  });
});
