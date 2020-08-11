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
      throw new Error(`pathString should be a valid absolute path but was ${pathString}`);
    }

    return result.result;
  }

  static getDirPath(path: AbsolutePath): AbsolutePath;
  static getDirPath(path: RelativePath): RelativePath;
  static getDirPath(path: AbsolutePath | RelativePath): Path {
    const rawParts = path.getParts();
    const parts = rawParts.slice(0, rawParts.length - 1);

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

    return parts[parts.length - 1] || null;
  }

  static getRelativePath(srcPath: AbsolutePath, destPath: AbsolutePath): RelativePath {
    let commonCount = 0;
    const thisParts = srcPath.getParts();
    const thatParts = destPath.getParts();
    while (commonCount < Math.min(thisParts.length, thatParts.length - 1)) {
      if (thisParts[commonCount] !== thatParts[commonCount]) {
        break;
      }

      commonCount++;
    }

    const upCount = thisParts.length - commonCount;
    const parts: string[] = [];
    for (let i = 0; i < upCount; i++) {
      parts.push('..');
    }

    return new RelativePath([
      ...parts,
      ...thatParts.slice(upCount),
    ]);
  }

  /**
   * @param path Path to return the subpaths to.
   * @return Subpaths to the root from the given path. For example, if path is '/a/b/c', this would
   *     return ['/a/b/c', '/a/b', '/a', '/'].
   */
  static getSubPathsToRoot(path: AbsolutePath): readonly AbsolutePath[] {
    const subpaths: AbsolutePath[] = [];
    let currentPath = path;
    while (currentPath && currentPath.getParts().length > 0) {
      subpaths.push(currentPath);
      currentPath = Paths.getDirPath(currentPath);
    }

    return subpaths;
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
      return Paths.normalize(new AbsolutePath(srcParts));
    } else if (root instanceof RelativePath) {
      return Paths.normalize(new RelativePath(srcParts));
    } else {
      throw assertUnreachable(root);
    }
  }

  static normalize(path: AbsolutePath): AbsolutePath;
  static normalize(path: RelativePath): RelativePath;
  static normalize(path: AbsolutePath | RelativePath): Path {
    // Removes all instances of '' parts.
    const noEmptyParts = path.getParts().filter(part => !!part);

    // Removes all instances of '.' part except the first one.
    const noCurrentParts: string[] = [];
    for (let i = 0; i < noEmptyParts.length; i++) {
      const part = noEmptyParts[i];
      if (i === 0 || part !== '.') {
        noCurrentParts.push(part);
      }
    }

    // Copy all trailing '..' part.
    const nonDoubleDotEntry = noCurrentParts
        .map((value, index) => [value, index] as [string, number])
        .filter(([part]) => part !== '..')[0];
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
      return new AbsolutePath(normalizedParts);
    } else if (path instanceof RelativePath) {
      return new RelativePath(normalizedParts);
    } else {
      throw assertUnreachable(path);
    }
  }

  static relativePath(pathString: string): RelativePath {
    const result = relativePathParser().convertBackward(pathString);
    if (!result.success) {
      throw new Error(`pathString should be a valid relative path but was ${pathString}`);
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
