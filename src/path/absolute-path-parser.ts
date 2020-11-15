import {Converter, Result} from 'nabu';

import {AbsolutePath} from '../path/absolute-path';
import {SEPARATOR} from '../path/path';

/**
 * Parses the string to {@link AbsolutePath}.
 *
 * @thHidden
 */
export class AbsolutePathParser implements Converter<AbsolutePath, string> {
  /**
   * Parses the input as an absolute path.
   *
   * @param value - Value to be parsed.
   * @returns Result of parsing.
   */
  convertBackward(value: string): Result<AbsolutePath> {
    if (!value) {
      return {success: false};
    }

    const parts = value.split(SEPARATOR);

    if (parts[0] !== '') {
      // This is not an absolute path.
      return {success: false};
    }

    return {result: new AbsolutePath(parts.slice(1)), success: true};
  }

  /**
   * Converts the path to string.
   *
   * @param input - Absolute path to be converted to string.
   * @returns Result of stringifying the path.
   */
  convertForward(input: AbsolutePath): Result<string> {
    return {result: input.toString(), success: true};
  }
}

/**
 * Creates parser for {@link AbsolutePath}.
 *
 * @returns Converter for `AbsolutePath`.
 * @thModule path
 */
export function absolutePathParser(): Converter<AbsolutePath, string> {
  return new AbsolutePathParser();
}
