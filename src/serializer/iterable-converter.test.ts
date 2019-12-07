import { arrayThat, assert, should, test } from '@gs-testing';

import { createImmutableList } from '../collect/types/immutable-list';
import { createImmutableSet } from '../collect/types/immutable-set';

import { integerConverter } from './integer-converter';
import { iterableConverter } from './iterable-converter';

test('serializer.IterableConverter', () => {
  test('convertBackward', () => {
    should(`convert correctly`, () => {
      const converter = iterableConverter(
          content => [...content],
          integerConverter(),
      );

      assert(converter.convertBackward([1, 2, 3])).to.haveProperties({
        result: arrayThat().haveExactElements([1, 2, 3]),
      });
    });

    should(`fail if one of the items cannot be converted`, () => {
      const converter = iterableConverter(
          content => createImmutableList([...content]),
          integerConverter(),
      );

      assert(converter.convertBackward([1, '2', 3])).to.haveProperties({success: false});
    });

    should(`fail if input is not an array`, () => {
      const converter = iterableConverter(
          content => createImmutableList([...content]),
          integerConverter(),
      );

      assert(converter.convertBackward('[1, 2, 3]')).to.haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should(`convert correctly`, () => {
      const converter = iterableConverter(
          content => createImmutableList([...content]),
          integerConverter(),
      );

      assert(converter.convertForward(createImmutableSet([1, 2, 3]))).to.haveProperties({
        result: arrayThat().haveElements([1, 2, 3]),
      });
    });

    should(`fail if one of the items cannot be converted`, () => {
      const converter = iterableConverter(
          content => createImmutableList([...content]),
          integerConverter(),
      );

      assert(converter.convertForward(createImmutableSet([1, 2.34, 3])))
          .to.haveProperties({success: false});
    });
  });
});
