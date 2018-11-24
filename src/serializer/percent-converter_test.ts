import { assert, should, test } from 'gs-testing/export/main';
import { percentConverter } from './percent-converter';


test('serializer.PercentConverter', () => {
  test('convertBackward', () => {
    should('convert correctly', () => {
      assert(percentConverter().convertBackward('123.45%')).to.haveProperties({result: 1.2345});
    });

    should('fail if the value is invalid number', () => {
      assert(percentConverter().convertBackward('abc%')).to.haveProperties({success: false});
    });

    should('fail if the value does not end with %', () => {
      assert(percentConverter().convertBackward('123')).to.haveProperties({success: false});
    });

    should('fail if the input is not a string', () => {
      assert(percentConverter().convertBackward(null)).to.haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should('convert correctly', () => {
      assert(percentConverter().convertForward(0.345)).to.haveProperties({result: '34.5%'});
    });
  });
});
