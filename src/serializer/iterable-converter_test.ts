import { assert, match, should, test } from 'gs-testing/export/main';
import { integerConverter } from './integer-converter';
import { iterableConverter } from './iterable-converter';

test('serializer.IterableConverter', () => {
  test('convertBackward', () => {
    should(`convert correctly`, () => {
      const converter = iterableConverter(content => content, integerConverter());

      assert(converter.convertBackward([1, 2, 3])).to.haveProperties({
        result: match.anyArrayThat().haveExactElements([1, 2, 3]),
      });
    });

    should(`fail if one of the items cannot be converted`, () => {
      const converter = iterableConverter(content => content, integerConverter());

      assert(converter.convertBackward([1, '2', 3])).to.haveProperties({success: false});
    });

    should(`fail if input is not an array`, () => {
      const converter = iterableConverter(content => content, integerConverter());

      assert(converter.convertBackward('[1, 2, 3]')).to.haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should(`convert correctly`, () => {
      const converter = iterableConverter(content => content, integerConverter());

      assert(converter.convertForward(new Set([1, 2, 3]))).to.haveProperties({
        result: match.anyArrayThat().haveElements([1, 2, 3]),
      });
    });

    should(`fail if one of the items cannot be converted`, () => {
      const converter = iterableConverter(content => content, integerConverter());

      assert(converter.convertForward(new Set([1, 2.34, 3]))).to.haveProperties({success: false});
    });
  });
});
