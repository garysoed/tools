import { ImmutableList } from '../immutable';
import { AbsolutePath } from '../path/absolute-path';
import { Path } from '../path/path';
import { RelativePath } from '../path/relative-path';
import { assertUnreachable } from '../typescript';

export class Paths {
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
    const parts = [];
    for (let i = 0; i < upCount; i++) {
      parts.push('..');
    }

    return new RelativePath(ImmutableList.of(parts).addAll(thatParts.slice(upCount)));
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
    const noCurrentParts = [];
    for (let i = 0; i < noEmptyParts.length; i++) {
      const part = noEmptyParts[i];
      if (i === 0 || part !== '.') {
        noCurrentParts.push(part);
      }
    }

    // Copy all trailing '..' part.
    const nonDoubleDotEntry = ImmutableList.of(noCurrentParts).findEntry((part) => part !== '..');
    const nonDoubleIndex = nonDoubleDotEntry ? nonDoubleDotEntry[0] + 1 : 0;
    const normalizedParts = [];
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
}
