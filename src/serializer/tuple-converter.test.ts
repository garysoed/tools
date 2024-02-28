import {assert, should, test, tupleThat} from 'gs-testing';

import {integerConverter} from './integer-converter';
import {tupleConverter} from './tuple-converter';

test('serializer.TupleConverter', () => {
  test('convertBackward', () => {
    should('convert correctly', () => {
      const converter = tupleConverter([
        integerConverter(),
        integerConverter(),
      ]);
      assert(converter.convertBackward([12.34, 34.56])).to.haveProperties({
        result: tupleThat<[number, number]>().haveExactElements([12, 35]),
      });
    });

    should('fail if one of the types is incorrect', () => {
      const converter = tupleConverter([
        integerConverter(),
        integerConverter(false),
      ]);
      assert(converter.convertBackward([12.34, 34.56])).to.haveProperties({
        success: false,
      });
    });

    should('fail if there are not enough converters', () => {
      const converter = tupleConverter([integerConverter()]);
      assert(converter.convertBackward([12.34, 34.56])).to.haveProperties({
        success: false,
      });
    });

    should('fail if there are too many converters', () => {
      const converter = tupleConverter([
        integerConverter(),
        integerConverter(),
      ]);
      assert(converter.convertBackward([12.34])).to.haveProperties({
        success: false,
      });
    });

    should('fail if the input is not an array', () => {
      const converter = tupleConverter([
        integerConverter(),
        integerConverter(),
      ]);
      assert(converter.convertBackward('string')).to.haveProperties({
        success: false,
      });
    });
  });

  test('convertForward', () => {
    should('convert correctly', () => {
      const converter = tupleConverter([
        integerConverter(),
        integerConverter(),
      ]);
      assert(converter.convertForward([12, 34])).to.haveProperties({
        result: tupleThat<[number, number]>().haveExactElements([12, 34]),
      });
    });

    should('fail if one of the items cannot be converted', () => {
      const converter = tupleConverter([
        integerConverter(),
        integerConverter(),
      ]);
      assert(converter.convertForward([12, 34.56])).to.haveProperties({
        success: false,
      });
    });
  });
});
