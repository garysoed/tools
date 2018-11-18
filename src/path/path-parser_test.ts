import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { AbsolutePath, PathParser, RelativePath } from '../path';


describe('path.PathParser', () => {
  describe('parse', () => {
    should(`parse absolute paths correctly`, () => {
      const path = PathParser.parse('/a/b/c');

      assert(path).to.beAnInstanceOf(AbsolutePath);
      assert(path!.toString()).to.equal('/a/b/c');
    });

    should(`parse relative paths correctly`, () => {
      const path = PathParser.parse('a/b/c');

      assert(path).to.beAnInstanceOf(RelativePath);
      assert(path!.toString()).to.equal('a/b/c');
    });

    should(`return null if the string is not a valid path`, () => {
      const path = PathParser.parse('');

      assert(path).to.beNull();
    });
  });
});
