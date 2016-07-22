import {IAttributeParser} from './interfaces';


/**
 * Attribute parser that handles float values.
 */
export const FloatParser: IAttributeParser<number> = {
  /**
   * Parses the given input string.
   *
   * @param input The input string.
   * @return The parsed float value, or NaN if it cannot be parsed.
   */
  parse(input: string | null): number {
    if (input === null) {
      return NaN;
    } else {
      return Number.parseFloat(input);
    }
  },

  /**
   * Converts the given number to string.
   *
   * @param value The number to be converted to string.
   * @return The string representation of the given number.
   */
  stringify(value: number): string {
    return value.toString(10);
  },
};
