import { assert, should, test } from 'gs-testing/export/main';
import { strict } from 'nabu/export/util';
import { AbsolutePath } from './absolute-path';
import { pathParser } from './path-parser';
import { RelativePath } from './relative-path';


test('path.PathParser', () => {
  test('convertBackward', () => {
    should(`parse absolute paths correctly`, () => {
      const path = strict(pathParser()).convertBackward('/a/b/c');

      assert(path).to.beAnInstanceOf(AbsolutePath);
      // tslint:disable-next-line:no-non-null-assertion
      assert(path!.toString()).to.equal('/a/b/c');
    });

    should(`parse relative paths correctly`, () => {
      const path = strict(pathParser()).convertBackward('a/b/c');

      assert(path).to.beAnInstanceOf(RelativePath);
      // tslint:disable-next-line:no-non-null-assertion
      assert(path!.toString()).to.equal('a/b/c');
    });

    should(`fail if the string is not a valid path`, () => {
      const path = pathParser().convertBackward('');

      assert(path).to.haveProperties({success: false});
    });
  });
});
