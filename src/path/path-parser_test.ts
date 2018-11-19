import { assert, should } from 'gs-testing/export/main';

import { AbsolutePath, PathParser, RelativePath } from '../path';


describe('path.PathParser', () => {
  describe('convertBackward', () => {
    should(`parse absolute paths correctly`, () => {
      const path = PathParser.convertBackward('/a/b/c');

      assert(path).to.beAnInstanceOf(AbsolutePath);
      // tslint:disable-next-line:no-non-null-assertion
      assert(path!.toString()).to.equal('/a/b/c');
    });

    should(`parse relative paths correctly`, () => {
      const path = PathParser.convertBackward('a/b/c');

      assert(path).to.beAnInstanceOf(RelativePath);
      // tslint:disable-next-line:no-non-null-assertion
      assert(path!.toString()).to.equal('a/b/c');
    });

    should(`return null if the string is not a valid path`, () => {
      const path = PathParser.convertBackward('');

      assert(path).to.beNull();
    });
  });
});
