import { FloatParser } from './float-parser';
import { Parser } from './parser';


export const PercentParser: Parser<number> = {
  /**
   * Parses the given input string.
   *
   * @param input The input string.
   * @return The parsed percentage value, or NaN if it cannot be parsed.
   */
  convertBackward(input: string | null): number | null {
    if (input === null) {
      return null;
    } else {
      if (input.endsWith('%')) {
        const parsed = FloatParser.convertBackward(input.substring(0, input.length - 1));

        return parsed === null ? null : parsed / 100;
      } else {
        return null;
      }
    }
  },

  /**
   * Converts the given number to string.
   *
   * @param value The number to be converted to string.
   * @return The string representation of the given number.
   */
  convertForward(value: number | null): string {
    if (value === null) {
      return '';
    }

    return `${(value * 100).toString(10)}%`;
  },
};
