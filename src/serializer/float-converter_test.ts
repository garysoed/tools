import { assert, should } from 'gs-testing/export/main';
import { floatConverter } from './float-converter';

describe('serializer.FloatConverter', () => {
  describe('parse', () => {
    should('return the parsed value correctly', () => {
      assert(floatConverter().convertBackward(1.23)).to.haveProperties({result: 1.23});
    });

    should('return null if the input is not a number', () => {
      assert(floatConverter().convertBackward('1.23')).to.haveProperties({success: false});
    });
  });

  describe('stringify', () => {
    should('return the number', () => {
      assert(floatConverter().convertForward(1.23)).to.haveProperties({result: 1.23});
    });
  });
});
