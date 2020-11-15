// tslint:disable:no-non-null-assertion
import {assert, should, test} from 'gs-testing';
import {strict} from 'nabu';

import {AbsolutePath} from './absolute-path';
import {pathParser} from './path-parser';
import {absolutePath, getDirPath, getFilenameParts, getItemName, getRelativePath, join, normalize, relativePath, setFilenameExt} from './paths';
import {RelativePath} from './relative-path';

test('path.Paths', () => {
  test('absolutePath', () => {
    should('return the correct path', () => {
      const path = absolutePath('/a/b/c');
      assert(path).to.beAnInstanceOf(AbsolutePath);
      assert(path.toString()).to.equal('/a/b/c');
    });

    should('throw error if the path is not an absolute path', () => {
      assert(() => {
        absolutePath('a/b/c');
      }).to.throwErrorWithMessage(/valid absolute path/);
    });
  });

  test('getDirPath', () => {
    should('return the correct directory for absolute paths', () => {
      // tslint:disable-next-line:no-non-null-assertion
      const dirPath = getDirPath(strict(pathParser()).convertBackward('/a/b/c')!);

      assert(dirPath).to.beAnInstanceOf(AbsolutePath);
      assert(dirPath.toString()).to.equal('/a/b');
    });

    should('return the correct directory for relative paths', () => {
      // tslint:disable-next-line:no-non-null-assertion
      const dirPath = getDirPath(strict(pathParser()).convertBackward('a/b/c')!);

      assert(dirPath).to.beAnInstanceOf(RelativePath);
      assert(dirPath.toString()).to.equal('a/b');
    });
  });

  test('getFilenameParts', () => {
    should('handle simple file names', () => {
      assert(getFilenameParts('test.ext')).to
          .haveProperties({extension: 'ext', name: 'test'});
    });

    should('handle file names with .', () => {
      assert(getFilenameParts('file.test.js')).to
          .haveProperties({extension: 'js', name: 'file.test'});
    });

    should('handle file names with no extensions', () => {
      assert(getFilenameParts('BUILD')).to.haveProperties({extension: '', name: 'BUILD'});
    });
  });

  test('getItemName', () => {
    should('return the correct item name', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getItemName(strict(pathParser()).convertBackward('a/b/c')!)).to.equal('c');
    });

    should('return null if path is root', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getItemName(strict(pathParser()).convertBackward('/')!)).to.beNull();
    });
  });

  test('getRelativePath', () => {
    should('return the correct relative path', () => {
      // tslint:disable-next-line:no-non-null-assertion
      const src = strict(pathParser()).convertBackward('/a/b/c/d')!;
      // tslint:disable-next-line:no-non-null-assertion
      const dest = strict(pathParser()).convertBackward('/a/b/e')!;
      const relative = getRelativePath(src, dest);

      assert(relative.toString()).to.equal('../../e');
    });
  });

  test('join', () => {
    should('handle absolute path correctly', () => {
      const joined = join(
          strict(pathParser()).convertBackward('/a/b')!,
          strict(pathParser()).convertBackward('c/d')!,
          strict(pathParser()).convertBackward('e')!);
      assert(joined).to.beAnInstanceOf(AbsolutePath);
      assert(joined.toString()).to.equal('/a/b/c/d/e');
    });

    should('handle relative path correctly', () => {
      const joined = join(
          strict(pathParser()).convertBackward('a/b')!,
          strict(pathParser()).convertBackward('c/d')!,
          strict(pathParser()).convertBackward('e')!);
      assert(joined).to.beAnInstanceOf(RelativePath);
      assert(joined.toString()).to.equal('a/b/c/d/e');
    });
  });

  test('normalize', () => {
    should('remove all instances of empty parts for absolute paths', () => {
      const normalized = normalize(strict(pathParser()).convertBackward('/a//b/c//')!);

      assert(normalized).to.beAnInstanceOf(AbsolutePath);
      assert(normalized.toString()).to.equal('/a/b/c');
    });

    should('remove all instances of empty parts for relative paths', () => {
      const normalized = normalize(strict(pathParser()).convertBackward('a//b/c//')!);

      assert(normalized).to.beAnInstanceOf(RelativePath);
      assert(normalized.toString()).to.equal('a/b/c');
    });

    should('remove all instances of \'.\'', () => {
      const normalized = normalize(strict(pathParser()).convertBackward('/a/./b/c/./')!);

      assert(normalized).to.beAnInstanceOf(AbsolutePath);
      assert(normalized.toString()).to.equal('/a/b/c');
    });

    should('remove all instances of \'.\' except the beginning one', () => {
      const normalized = normalize(strict(pathParser()).convertBackward('./a/./b/c/./')!);

      assert(normalized).to.beAnInstanceOf(RelativePath);
      assert(normalized.toString()).to.equal('./a/b/c');
    });

    should('process \'..\' correctly for absolute paths', () => {
      const normalized = normalize(strict(pathParser())
          .convertBackward('/a/b/c/../../b/../c/d/..')!);

      assert(normalized).to.beAnInstanceOf(AbsolutePath);
      assert(normalized.toString()).to.equal('/a/c');
    });

    should('process \'..\' correctly for relative paths', () => {
      const normalized1 = normalize(strict(pathParser())
          .convertBackward('../../a/../../b/../c/d/..')!);

      assert(normalized1).to.beAnInstanceOf(RelativePath);
      assert(normalized1.toString()).to.equal('../../../c');

      const normalized2 = normalize(strict(pathParser())
          .convertBackward('a/../../b/../c/d/..')!);

      assert(normalized2).to.beAnInstanceOf(RelativePath);
      assert(normalized2.toString()).to.equal('../c');
    });
  });

  test('relativePath', () => {
    should('return the correct path', () => {
      const path = relativePath('a/b/c');
      assert(path).to.beAnInstanceOf(RelativePath);
      assert(path.toString()).to.equal('a/b/c');
    });

    should('throw error if the path is not an relative path', () => {
      assert(() => {
        relativePath('/a/b/c');
      }).to.throwErrorWithMessage(/valid relative path/);
    });
  });

  test('setFilenameExt', () => {
    should('handle simple file names', () => {
      assert(setFilenameExt('test.ext', 'ext2').toString()).to.equal('test.ext2');
      assert(setFilenameExt('test.ext', '').toString()).to.equal('test');
    });

    should('handle file names with .', () => {
      assert(setFilenameExt('file.test.js', 'ext2').toString()).to.equal('file.test.ext2');
      assert(setFilenameExt('file.test.js', '').toString()).to.equal('file.test');
    });

    should('handle file names with no extensions', () => {
      assert(setFilenameExt('BUILD', 'ext2').toString()).to.equal('BUILD.ext2');
      assert(setFilenameExt('BUILD', '').toString()).to.equal('BUILD');
    });
  });
});
