import {assert, setup, should, test} from 'gs-testing';
import {numberType} from 'gs-types';
import {strict} from 'nabu';

import {typeBased} from './type-based-converter';


test('serializer.TypeBasedConverter', () => {
  const _ = setup(() => {
    const converter = typeBased(numberType);
    return {converter};
  });

  test('convertBackward', () => {
    should('convert correctly', () => {
      assert(strict(_.converter).convertBackward(123)).to.equal(123);
    });

    should('fail if the type is wrong', () => {
      assert(_.converter.convertBackward('abc').success).to.beFalse();
    });
  });

  test('convertForward', () => {
    should('convert correctly', () => {
      assert(strict(_.converter).convertForward(123)).to.equal(123);
    });
  });
});
