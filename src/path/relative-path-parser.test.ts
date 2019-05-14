import { assert, should, test } from '@gs-testing';
import { strict } from '@nabu';
import { createImmutableList } from '../collect/types/immutable-list';
import { RelativePath } from './relative-path';
import { relativePathParser } from './relative-path-parser';


test('path.RelativePathParser', () => {
  test('convertBackward', () => {
    should(`return the correct path`, () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(strict(relativePathParser()).convertBackward('a/b/c')!.toString())
          .to.equal('a/b/c');
    });

    should(`return null if the path is absolute`, () => {
      assert(relativePathParser().convertBackward('/a/b/c')).to.haveProperties({success: false});
    });

    should(`return null if the string is empty`, () => {
      assert(relativePathParser().convertBackward('')).to.haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should(`return the correct string`, () => {
      const converted = strict(relativePathParser())
          .convertForward(new RelativePath(createImmutableList(['a', 'b', 'c'])()));
      assert(converted).to.equal('a/b/c');
    });
  });
});
