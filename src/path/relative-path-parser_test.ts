import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList } from '../immutable';
import { RelativePath, RelativePathParser } from '../path';


describe('path.RelativePathParser', () => {
  describe('parse', () => {
    it(`should return the correct path`, () => {
      assert(RelativePathParser.parse('a/b/c')!.toString()).to.equal('a/b/c');
    });

    it(`should return null if the path is absolute`, () => {
      assert(RelativePathParser.parse('/a/b/c')).to.beNull();
    });

    it(`should return null if the string is empty`, () => {
      assert(RelativePathParser.parse('')).to.beNull();
    });

    it(`should return null if the input is null`, () => {
      assert(RelativePathParser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should return the correct string`, () => {
      assert(RelativePathParser.stringify(new RelativePath(ImmutableList.of(['a', 'b', 'c']))))
          .to.equal('a/b/c');
    });

    it(`should return empty string if value is null`, () => {
      assert(RelativePathParser.stringify(null)).to.equal('');
    });
  });
});
