import { Parser } from '../interfaces/parser';


/**
 * Attribute parser that handles float values.
 */
export const HexParser: Parser<number> = {
  /**
   * Parses the given input string.
   *
   * @param input The input string.
   * @return The parsed float value, or NaN if it cannot be parsed.
   */
  parse(input: string | null): number | null {
    if (input === null) {
      return null;
    } else {
      const result = Number.parseInt(input, 16);
      return Number.isNaN(result) ? null : result;
    }
  },

  /**
   * Converts the given number to string.
   *
   * @param value The number to be converted to string.
   * @return The string representation of the given number.
   */
  stringify(value: number | null): string {
    if (value === null) {
      return '';
    }
    return value.toString(16);
  },
};
// TODO: Mutable
