import { assert, match, should, test } from 'gs-testing/export/main';
import { integerConverter } from './integer-converter';
import { objectConverter } from './object-converter';

test('serializer.ObjectConverter', () => {
  test('convertBackward', () => {
    should(`convert correctly`, () => {
      const converter = objectConverter({a: integerConverter(), b: integerConverter()});

      assert(converter.convertBackward({a: 12, b: 34})).to.haveProperties({
        result: match.anyObjectThat().haveProperties({a: 12, b: 34}),
      });
    });

    should(`fail if one of the items failed to convert`, () => {
      const converter = objectConverter({a: integerConverter(false), b: integerConverter()});

      assert(converter.convertBackward({a: 12.34, b: 34})).to.haveProperties({success: false});
    });

    should(`fail if the key does not exist`, () => {
      const converter = objectConverter({a: integerConverter(), b: integerConverter()});

      assert(converter.convertBackward({a: 12})).to.haveProperties({success: false});
    });

    should(`return null if not an object`, () => {
      const converter = objectConverter({a: integerConverter(), b: integerConverter()});

      assert(converter.convertBackward('string')).to.haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should(`stringify correctly`, () => {
      const converter = objectConverter({a: integerConverter(), b: integerConverter()});

      assert(converter.convertForward({a: 456, b: 123})).to.haveProperties({
        result: match.anyObjectThat().haveProperties({a: 456, b: 123}),
      });
    });

    should(`fail if one of the entries failed to convert`, () => {
      const converter = objectConverter({a: integerConverter(), b: integerConverter()});

      assert(converter.convertForward({a: 456.123, b: 123})).to.haveProperties({success: false});
    });
  });
});
