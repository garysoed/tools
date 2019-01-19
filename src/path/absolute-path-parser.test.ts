import { assert, should, test } from 'gs-testing/export/main';

import { SuccessResult } from 'nabu/export/main';
import { createImmutableList } from '../collect/types/immutable-list';
import { AbsolutePath } from './absolute-path';
import { absolutePathParser } from './absolute-path-parser';

test('path.AbsolutePathParser', () => {
  test('convertBackward', () => {
    should(`return the correct path`, () => {
      const result = absolutePathParser().convertBackward('/a/b/c') as SuccessResult<AbsolutePath>;
      assert(result.result.toString()).to.equal('/a/b/c');
    });

    should(`fail if the path is not absolute`, () => {
      assert(absolutePathParser().convertBackward('a/b/c')).to.haveProperties({success: false});
    });

    should(`fail if the string is empty`, () => {
      assert(absolutePathParser().convertBackward('')).to.haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should(`return the correct string`, () => {
      const result = absolutePathParser()
          .convertForward(new AbsolutePath(createImmutableList(['a', 'b', 'c'])()));
      assert(result).to.haveProperties({result: '/a/b/c'});
    });
  });
});
