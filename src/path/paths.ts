import {AbsolutePath} from '../path/absolute-path';
import {Path} from '../path/path';
import {RelativePath} from '../path/relative-path';
import {assertUnreachable} from '../typescript/assert-unreachable';

import {absolutePathParser} from './absolute-path-parser';
import {relativePathParser} from './relative-path-parser';

/**
 * Creates an {@link AbsolutePath} by parsing the given string.
 *
 * @param pathString - String to parse as `AbsolutePath`.
 * @returns The parsed string as `AbsolutePath`.
 *
 * @thModule path
 */
export function absolutePath(pathString: string): AbsolutePath {
  const result = absolutePathParser().convertBackward(pathString);
  if (!result.success) {
    throw new Error(
      `pathString should be a valid absolute path but was ${pathString}`,
    );
  }

  return result.result;
}

/**
 * Returns the directory part of the path.
 *
 * @remarks
 * If this is given `AbsolutePath`, this returns `AbsolutePath`. If this is given `RelativePath`,
 * this returns `RelativePath`.
 *
 * @param path - Path to return the directory's path of.
 *
 * @thModule path
 */
export function getDirPath(path: AbsolutePath): AbsolutePath;
/**
 * @param path - Path to return the directory's path of.
 */
export function getDirPath(path: RelativePath): RelativePath;
export function getDirPath(path: AbsolutePath | RelativePath): Path {
  const rawParts = path.parts;
  const parts = rawParts.slice(0, rawParts.length - 1);

  if (path instanceof AbsolutePath) {
    return new AbsolutePath(parts);
  } else if (path instanceof RelativePath) {
    return new RelativePath(parts);
  } else {
    throw assertUnreachable(path);
  }
}

/**
 * Parts of a file.
 *
 * @thModule path
 */
export interface FileParts {
  /**
   * Extension of the file.
   */
  readonly extension: string;

  /**
   * Name part of the file.
   */
  readonly name: string;
}

/**
 * Splits the given filename into its name and extension.
 *
 * @param filename - File name to split into parts.
 * @returns Object with the file's extension and name.
 *
 * @thModule path
 */
export function getFilenameParts(filename: string): {
  extension: string;
  name: string;
} {
  const parts = filename.split('.');
  const extensionIndex = Math.max(1, parts.length - 1);
  const extension = parts[extensionIndex] || '';

  return {
    extension,
    name: parts.slice(0, extensionIndex).join('.'),
  };
}

/**
 * Returns the item part of the path.
 *
 * @param path - Path to return the item name.
 * @returns The item part, or null if the path is a directory
 *
 * @thModule path
 */
export function getItemName(path: Path): string | null {
  const parts = path.parts;

  return parts[parts.length - 1] || null;
}

/**
 * Returns the relative path from the `srcPath` to the `destPath`.
 *
 * @param srcPath - The starting path.
 * @param destPath - The destination path.
 * @returns Relative path from the source path to the destination path.
 *
 * @thModule path
 */
export function getRelativePath(
  srcPath: AbsolutePath,
  destPath: AbsolutePath,
): RelativePath {
  let commonCount = 0;
  const thisParts = srcPath.parts;
  const thatParts = destPath.parts;
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

  return new RelativePath([...parts, ...thatParts.slice(upCount)]);
}

/**
 * Navigate to the root path and returns subpaths to the root path.
 *
 * @remarks
 * For example, if path is '/a/b/c', this would return ['/a/b/c', '/a/b', '/a', '/'].
 *
 * @param path - Path to return the subpaths to.
 * @returns Subpaths to the root from the given path.
 *
 * @thModule path
 */
export function getSubPathsToRoot(path: AbsolutePath): readonly AbsolutePath[] {
  const subpaths: AbsolutePath[] = [];
  let currentPath = path;
  while (currentPath && currentPath.parts.length > 0) {
    subpaths.push(currentPath);
    currentPath = getDirPath(currentPath);
  }

  return subpaths;
}

/**
 * Joins the given paths together in order.
 *
 * @remarks
 * If the root path is absolute, the resulting path will also be absolute. Similarly, if the root
 * path is relative, the resulting path will also be relative.
 *
 * @param root - The root path.
 * @param paths - Paths to join together.
 *
 * @thModule path
 */
export function join(
  root: AbsolutePath,
  ...paths: readonly RelativePath[]
): AbsolutePath;
/**
 * @param root - The root path.
 * @param paths - Paths to join together.
 */
export function join(
  root: RelativePath,
  ...paths: readonly RelativePath[]
): RelativePath;
export function join(
  root: AbsolutePath | RelativePath,
  ...paths: readonly RelativePath[]
): Path {
  const srcParts = [...root.parts];
  for (const path of paths) {
    for (const part of path.parts) {
      srcParts.push(part);
    }
  }

  if (root instanceof AbsolutePath) {
    return normalize(new AbsolutePath(srcParts));
  } else if (root instanceof RelativePath) {
    return normalize(new RelativePath(srcParts));
  } else {
    throw assertUnreachable(root);
  }
}

/**
 * Normalizes the given path.
 *
 * @remarks
 * This removes all instances where the part is empty, and removes any unnecessary `..` and `.`.
 *
 * @param path - Absolute path to normalize.
 * @returns The normalized absolute path.
 *
 * @thModule path
 */
export function normalize(path: AbsolutePath): AbsolutePath;
/**
 * @param path - Absolute path to normalize.
 * @returns The normalized absolute path.
 */
export function normalize(path: RelativePath): RelativePath;
export function normalize(path: AbsolutePath | RelativePath): Path {
  // Removes all instances of '' parts.
  const noEmptyParts = path.parts.filter((part) => !!part);

  // Removes all instances of '.' part except the first one.
  const noCurrentParts: string[] = [];
  noEmptyParts.forEach((part, i) => {
    if (i === 0 || part !== '.') {
      noCurrentParts.push(part);
    }
  });

  // Copy all trailing '..' part.
  const nonDoubleDotEntry = noCurrentParts
    .map((value, index) => [value, index] as [string, number])
    .filter(([part]) => part !== '..')[0];
  const nonDoubleIndex = nonDoubleDotEntry ? nonDoubleDotEntry[1] + 1 : 0;
  const normalizedParts: string[] = [];
  for (let i = 0; i < nonDoubleIndex; i++) {
    const part = noCurrentParts[i];
    if (part === undefined) {
      throw new Error(`No parts found at index ${i}`);
    }
    normalizedParts.push(part);
  }

  for (let i = nonDoubleIndex; i < noCurrentParts.length; i++) {
    const part = noCurrentParts[i];
    if (part === undefined) {
      throw new Error(`No parts found at index ${i}`);
    }
    if (
      part === '..' &&
      normalizedParts.length > 0 &&
      normalizedParts[normalizedParts.length - 1] !== '..'
    ) {
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

/**
 * Creates an {@link RelativePath} by parsing the given string.
 *
 * @param pathString - String to parse as `RelativePath`.
 * @returns The parsed string as `RelativePath`.
 * @thModule path
 */
export function relativePath(pathString: string): RelativePath {
  const result = relativePathParser().convertBackward(pathString);
  if (!result.success) {
    throw new Error(
      `pathString should be a valid relative path but was ${pathString}`,
    );
  }

  return result.result;
}

/**
 * Given a filename and an extension, create an item name.
 *
 * @param filename - The filename without extension.
 * @param extension - The extension name.
 * @returns The item name with the filename and extension parts.
 * @thModule
 */
export function setFilenameExt(filename: string, extension: string): string {
  const {name} = getFilenameParts(filename);

  if (!extension) {
    return name;
  }

  return `${name}.${extension}`;
}
