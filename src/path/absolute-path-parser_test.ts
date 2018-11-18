import { assert, should } from 'gs-testing/export/main';

import { ImmutableList } from '../immutable';
import { AbsolutePathParser } from '../path';
import { AbsolutePath } from '../path/absolute-path';


describe('path.AbsolutePathParser', () => {
  describe('parse', () => {
    should(`return the correct path`, () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(AbsolutePathParser.parse('/a/b/c')!.toString()).to.equal('/a/b/c');
    });

    should(`return null if the path is not absolute`, () => {
      assert(AbsolutePathParser.parse('a/b/c')).to.beNull();
    });

    should(`return null if the string is empty`, () => {
      assert(AbsolutePathParser.parse('')).to.beNull();
    });

    should(`return null if the input is null`, () => {
      assert(AbsolutePathParser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    should(`return the correct string`, () => {
      assert(AbsolutePathParser.stringify(new AbsolutePath(ImmutableList.of(['a', 'b', 'c']))))
          .to.equal('/a/b/c');
    });

    should(`return empty string if value is null`, () => {
      assert(AbsolutePathParser.stringify(null)).to.equal('');
    });
  });
});
