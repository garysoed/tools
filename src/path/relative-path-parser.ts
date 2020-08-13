import { Converter, Result } from 'nabu';

import { Path, SEPARATOR } from '../path/path';
import { RelativePath } from '../path/relative-path';

/**
 * Parses the string to {@link RelativePath}.
 *
 * @thHidden
 * @thModule path
 */
export class RelativePathParser implements Converter<RelativePath, string> {
  /**
   * Parses the input as an relative path.
   *
   * @param value - Value to be parsed.
   * @returns Result of parsing.
   */
  convertBackward(input: string): Result<RelativePath> {
    if (!input) {
      return {success: false};
    }

    const parts = input.split(SEPARATOR);

    if (parts[0] === '') {
      // This is an abolute path.
      return {success: false};
    }

    return {result: new RelativePath(parts), success: true};
  }

  /**
   * Converts the path to string.
   *
   * @param input - Relative path to be converted to string.
   * @returns Result of stringifying the path.
   */
  convertForward(input: RelativePath): Result<string> {
    return {result: input.toString(), success: true};
  }
}

export function relativePathParser(): RelativePathParser {
  return new RelativePathParser();
}
