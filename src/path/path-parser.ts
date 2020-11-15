import {Converter, Result, firstSuccess} from 'nabu';

import {absolutePathParser} from '../path/absolute-path-parser';
import {Path} from '../path/path';
import {relativePathParser} from '../path/relative-path-parser';


/**
 * Parses the string to {@link Path}.
 *
 * @remarks
 * This tries to parse as a relative parse. If that doesn't work, it tries to parse as absolute
 * parse.
 *
 * @thHidden
 */
class PathParser implements Converter<Path, string> {
  /**
   * Parses the input as a path.
   *
   * @param value - Value to be parsed.
   * @returns Result of parsing.
   */
  convertBackward(value: string): Result<Path> {
    return firstSuccess(relativePathParser(), absolutePathParser()).convertBackward(value);
  }

  /**
   * Converts the path to string.
   *
   * @param input - Path to be converted to string.
   * @returns Result of stringifying the path.
   */
  convertForward(input: Path): Result<string> {
    return {result: input.toString(), success: true};
  }
}

/**
 * Creates parser for {@link Path}.
 *
 * @returns Converter for `Path`.
 * @thModule path
 */
export function pathParser(): Converter<Path, string> {
  return new PathParser();
}
