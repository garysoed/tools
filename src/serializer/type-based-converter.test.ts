import { assert, should, test } from '@gs-testing';
import { NumberType } from '@gs-types';
import { Converter, Serializable, strict } from '@nabu';
import { typeBased } from './type-based-converter';

test('serializer.TypeBasedConverter', () => {
  let converter: Converter<number, Serializable>;

  beforeEach(() => {
    converter = typeBased(NumberType);
  });

  test('convertBackward', () => {
    should(`convert correctly`, () => {
      assert(strict(converter).convertBackward(123)).to.equal(123);
    });

    should(`fail if the type is wrong`, () => {
      assert(converter.convertBackward('abc').success).to.beFalse();
    });
  });

  test('convertForward', () => {
    should(`convert correctly`, () => {
      assert(strict(converter).convertForward(123)).to.equal(123);
    });
  });
});
