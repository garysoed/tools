import { AbsolutePath } from './absolute-path';
import { RelativePath } from './relative-path';
import { assert, should, test } from 'gs-testing';
import { pathParser } from './path-parser';
import { strict } from 'nabu';


test('path.PathParser', () => {
  test('convertBackward', () => {
    should('parse absolute paths correctly', () => {
      const path = strict(pathParser()).convertBackward('/a/b/c');

      assert(path).to.beAnInstanceOf(AbsolutePath);
      // tslint:disable-next-line:no-non-null-assertion
      assert(path!.toString()).to.equal('/a/b/c');
    });

    should('parse relative paths correctly', () => {
      const path = strict(pathParser()).convertBackward('a/b/c');

      assert(path).to.beAnInstanceOf(RelativePath);
      // tslint:disable-next-line:no-non-null-assertion
      assert(path!.toString()).to.equal('a/b/c');
    });

    should('fail if the string is not a valid path', () => {
      const path = pathParser().convertBackward('');

      assert(path).to.haveProperties({success: false});
    });
  });
});
