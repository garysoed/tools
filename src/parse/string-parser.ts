import { Parser } from '../interfaces/parser';


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
  parse(input: string | null): string | null {
    return input;
  },

  /**
   * @param value
   * @return The string value.
   */
  stringify(value: string): string {
    return value;
  },
};
// TODO: Mutable
