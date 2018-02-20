import { Errors } from '../error';
import { ImmutableList } from '../immutable';
import { AbsolutePath } from '../path/absolute-path';
import { AbsolutePathParser } from '../path/absolute-path-parser';
import { Path } from '../path/path';
import { RelativePath } from '../path/relative-path';
import { RelativePathParser } from '../path/relative-path-parser';
import { assertUnreachable } from '../typescript';

export class Paths {
  static absolutePath(pathString: string): AbsolutePath {
    const path = AbsolutePathParser.parse(pathString);
    if (!path) {
      throw Errors.assert('pathString').shouldBe('a valid absolute path').butWas(pathString);
    }
    return path;
  }

  static getDirPath(path: AbsolutePath): AbsolutePath;
  static getDirPath(path: RelativePath): RelativePath;
  static getDirPath(path: AbsolutePath | RelativePath): Path {
    const parts = path.getParts().slice(0, -1);
    if (path instanceof AbsolutePath) {
      return new AbsolutePath(parts);
    } else if (path instanceof RelativePath) {
      return new RelativePath(parts);
    } else {
      throw assertUnreachable(path);
    }
  }

  static getItemName(path: Path): string | null {
    const parts = path.getParts();
    return parts.getAt(-1) || null;
  }

  static getRelativePath(srcPath: AbsolutePath, destPath: AbsolutePath): RelativePath {
    let commonCount = 0;
    const thisParts = srcPath.getParts();
    const thatParts = destPath.getParts();
    while (commonCount < Math.min(thisParts.size(), thatParts.size()) - 1) {
      if (thisParts.getAt(commonCount) !== thatParts.getAt(commonCount)) {
        break;
      }

      commonCount++;
    }

    const upCount = thisParts.size() - commonCount;
    const parts: string[] = [];
    for (let i = 0; i < upCount; i++) {
      parts.push('..');
    }

    return new RelativePath(ImmutableList.of(parts).addAll(thatParts.slice(upCount)));
  }

  /**
   * @param path Path to return the subpaths to.
   * @return Subpaths to the root from the given path. For example, if path is '/a/b/c', this would
   *     return ['/a/b/c', '/a/b', '/a', '/'].
   */
  static getSubPathsToRoot(path: AbsolutePath): ImmutableList<AbsolutePath> {
    const subpaths: AbsolutePath[] = [];
    let currentPath = path;
    while (currentPath && currentPath.getParts().size() > 0) {
      subpaths.push(currentPath);
      currentPath = Paths.getDirPath(currentPath);
    }

    return ImmutableList.of(subpaths);
  }

  static join(root: AbsolutePath, ...paths: RelativePath[]): AbsolutePath;
  static join(root: RelativePath, ...paths: RelativePath[]): RelativePath;
  static join(root: AbsolutePath | RelativePath, ...paths: RelativePath[]): Path {
    const srcParts = [...root.getParts()];
    for (const path of paths) {
      for (const part of path.getParts()) {
        srcParts.push(part);
      }
    }

    if (root instanceof AbsolutePath) {
      return new AbsolutePath(ImmutableList.of(srcParts));
    } else if (root instanceof RelativePath) {
      return new RelativePath(ImmutableList.of(srcParts));
    } else {
      throw assertUnreachable(root);
    }
  }

  static normalize(path: AbsolutePath): AbsolutePath;
  static normalize(path: RelativePath): RelativePath;
  static normalize(path: AbsolutePath | RelativePath): Path {
    // Removes all instances of '' parts.
    const noEmptyParts = [...path.getParts().filter((part) => !!part)];

    // Removes all instances of '.' part except the first one.
    const noCurrentParts: string[] = [];
    for (let i = 0; i < noEmptyParts.length; i++) {
      const part = noEmptyParts[i];
      if (i === 0 || part !== '.') {
        noCurrentParts.push(part);
      }
    }

    // Copy all trailing '..' part.
    const nonDoubleDotEntry = ImmutableList.of(noCurrentParts).findEntry((part) => part !== '..');
    const nonDoubleIndex = nonDoubleDotEntry ? nonDoubleDotEntry[0] + 1 : 0;
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
      return new AbsolutePath(ImmutableList.of(normalizedParts));
    } else if (path instanceof RelativePath) {
      return new RelativePath(ImmutableList.of(normalizedParts));
    } else {
      throw assertUnreachable(path);
    }
  }

  static relativePath(pathString: string): RelativePath {
    const path = RelativePathParser.parse(pathString);
    if (!path) {
      throw Errors.assert('pathString').shouldBe('a valid relative path').butWas(pathString);
    }
    return path;
  }
}
