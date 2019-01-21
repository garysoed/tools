import { exec } from '../collect/exec';
import { countable } from '../collect/generators';
import { filter } from '../collect/operators/filter';
import { head } from '../collect/operators/head';
import { push } from '../collect/operators/push';
import { size } from '../collect/operators/size';
import { skip } from '../collect/operators/skip';
import { tail } from '../collect/operators/tail';
import { take } from '../collect/operators/take';
import { zip } from '../collect/operators/zip';
import { asImmutableList, createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { Errors } from '../error';
import { AbsolutePath } from '../path/absolute-path';
import { Path } from '../path/path';
import { RelativePath } from '../path/relative-path';
import { assertUnreachable } from '../typescript/assert-unreachable';
import { absolutePathParser } from './absolute-path-parser';
import { relativePathParser } from './relative-path-parser';

export class Paths {
  static absolutePath(pathString: string): AbsolutePath {
    const result = absolutePathParser().convertBackward(pathString);
    if (!result.success) {
      throw Errors.assert('pathString').shouldBe('a valid absolute path').butWas(pathString);
    }

    return result.result;
  }

  static getDirPath(path: AbsolutePath): AbsolutePath;
  static getDirPath(path: RelativePath): RelativePath;
  static getDirPath(path: AbsolutePath | RelativePath): Path {
    const parts = exec(
        path.getParts(),
        take(exec(path.getParts(), size()) - 1),
        asImmutableList<string>(),
    );
    if (path instanceof AbsolutePath) {
      return new AbsolutePath(parts);
    } else if (path instanceof RelativePath) {
      return new RelativePath(parts);
    } else {
      throw assertUnreachable(path);
    }
  }

  static getFilenameParts(filename: string): {extension: string; name: string} {
    const parts = filename.split('.');
    const extensionIndex = Math.max(1, parts.length - 1);
    const extension = parts[extensionIndex] || '';

    return {
      extension,
      name: parts.slice(0, extensionIndex).join('.'),
    };
  }

  static getItemName(path: Path): string | null {
    const parts = path.getParts();

    return exec(parts, tail()) || null;
  }

  static getRelativePath(srcPath: AbsolutePath, destPath: AbsolutePath): RelativePath {
    let commonCount = 0;
    const thisParts = srcPath.getParts();
    const thatParts = destPath.getParts();
    while (commonCount < Math.min(exec(thisParts, size()), exec(thatParts, size())) - 1) {
      if (exec(thisParts, skip(commonCount), head()) !==
          exec(thatParts, skip(commonCount), head())) {
        break;
      }

      commonCount++;
    }

    const upCount = exec(thisParts, size()) - commonCount;
    const parts: string[] = [];
    for (let i = 0; i < upCount; i++) {
      parts.push('..');
    }

    return new RelativePath(
        exec(
            createImmutableList(parts),
            push(...exec(thatParts, skip(upCount))()),
            asImmutableList<string>(),
        )(),
    );
  }

  /**
   * @param path Path to return the subpaths to.
   * @return Subpaths to the root from the given path. For example, if path is '/a/b/c', this would
   *     return ['/a/b/c', '/a/b', '/a', '/'].
   */
  static getSubPathsToRoot(path: AbsolutePath): ImmutableList<AbsolutePath> {
    const subpaths: AbsolutePath[] = [];
    let currentPath = path;
    while (currentPath && exec(currentPath.getParts(), size()) > 0) {
      subpaths.push(currentPath);
      currentPath = Paths.getDirPath(currentPath);
    }

    return createImmutableList(subpaths);
  }

  static join(root: AbsolutePath, ...paths: RelativePath[]): AbsolutePath;
  static join(root: RelativePath, ...paths: RelativePath[]): RelativePath;
  static join(root: AbsolutePath | RelativePath, ...paths: RelativePath[]): Path {
    const srcParts = [...root.getParts()()];
    for (const path of paths) {
      for (const part of path.getParts()()) {
        srcParts.push(part);
      }
    }

    if (root instanceof AbsolutePath) {
      return Paths.normalize(new AbsolutePath(createImmutableList(srcParts)()));
    } else if (root instanceof RelativePath) {
      return Paths.normalize(new RelativePath(createImmutableList(srcParts)()));
    } else {
      throw assertUnreachable(root);
    }
  }

  static normalize(path: AbsolutePath): AbsolutePath;
  static normalize(path: RelativePath): RelativePath;
  static normalize(path: AbsolutePath | RelativePath): Path {
    // Removes all instances of '' parts.
    const noEmptyParts = [...exec(path.getParts(), filter(part => !!part))()];

    // Removes all instances of '.' part except the first one.
    const noCurrentParts: string[] = [];
    for (let i = 0; i < noEmptyParts.length; i++) {
      const part = noEmptyParts[i];
      if (i === 0 || part !== '.') {
        noCurrentParts.push(part);
      }
    }

    // Copy all trailing '..' part.
    const nonDoubleDotEntry = exec(
        createImmutableList(noCurrentParts),
        zip(countable()),
        filter(([part]) => part !== '..'),
        head(),
    );
    const nonDoubleIndex = nonDoubleDotEntry ? nonDoubleDotEntry[1] + 1 : 0;
    const normalizedParts: string[] = [];
    for (let i = 0; i < nonDoubleIndex; i++) {
      normalizedParts.push(noCurrentParts[i]);
    }

    for (let i = nonDoubleIndex; i < noCurrentParts.length; i++) {
      const part = noCurrentParts[i];
      if (part === '..'
          && normalizedParts.length > 0
          && normalizedParts[normalizedParts.length - 1] !== '..') {
        normalizedParts.pop();
      } else {
        normalizedParts.push(part);
      }
    }

    if (path instanceof AbsolutePath) {
      return new AbsolutePath(createImmutableList(normalizedParts)());
    } else if (path instanceof RelativePath) {
      return new RelativePath(createImmutableList(normalizedParts)());
    } else {
      throw assertUnreachable(path);
    }
  }

  static relativePath(pathString: string): RelativePath {
    const result = relativePathParser().convertBackward(pathString);
    if (!result.success) {
      throw Errors.assert('pathString').shouldBe('a valid relative path').butWas(pathString);
    }

    return result.result;
  }

  static setFilenameExt(filename: string, extension: string): string {
    const {name} = Paths.getFilenameParts(filename);

    if (!extension) {
      return name;
    }

    return `${name}.${extension}`;
  }
}
