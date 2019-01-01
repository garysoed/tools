import { assert, should, test } from 'gs-testing/export/main';
import { stringMatchConverter } from './string-match-converter';

test('serializable.StringMatchConverter', () => {
  test('convertBackward', () => {
    should(`return the string if it is in the set`, () => {
      assert(stringMatchConverter(['a', 'b']).convertBackward('a')).to
          .haveProperties({result: 'a'});
    });

    should(`fail if the string is not in the set`, () => {
      assert(stringMatchConverter(['a', 'b']).convertBackward('c')).to
          .haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should(`return the string`, () => {
      assert(stringMatchConverter(['a', 'b']).convertForward('a')).to.haveProperties({result: 'a'});
    });

    should(`fail if the string is not in the acceptable set`, () => {
      assert(stringMatchConverter<string>(['a', 'b']).convertForward('c')).to
          .haveProperties({success: false});
    });
  });
});
