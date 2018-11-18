import { Parser } from './parser';


/**
 * Attribute parser that handles string values. This is basically a noop.
 */
export const StringParser: Parser<string> = {
  /**
   * Parses the given input string.
   *
   * @param input The input string.
   * @return The string value.
   */
  convertForward(input: string | null): string | null {
    return input;
  },

  /**
   * @return The string value.
   */
  convertBackward(value: string): string {
    return value;
  },
};
