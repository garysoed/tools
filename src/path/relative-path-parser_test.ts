import { assert, should } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable';
import { RelativePath, RelativePathParser } from '../path';


describe('path.RelativePathParser', () => {
  describe('convertBackward', () => {
    should(`return the correct path`, () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(RelativePathParser.convertBackward('a/b/c')!.toString()).to.equal('a/b/c');
    });

    should(`return null if the path is absolute`, () => {
      assert(RelativePathParser.convertBackward('/a/b/c')).to.beNull();
    });

    should(`return null if the string is empty`, () => {
      assert(RelativePathParser.convertBackward('')).to.beNull();
    });

    should(`return null if the input is null`, () => {
      assert(RelativePathParser.convertBackward(null)).to.beNull();
    });
  });

  describe('convertForward', () => {
    should(`return the correct string`, () => {
      assert(RelativePathParser.convertForward(new RelativePath(ImmutableList.of(['a', 'b', 'c']))))
          .to.equal('a/b/c');
    });

    should(`return empty string if value is null`, () => {
      assert(RelativePathParser.convertForward(null)).to.equal('');
    });
  });
});
