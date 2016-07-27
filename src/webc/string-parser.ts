import {IAttributeParser} from './interfaces';


/**
 * Attribute parser that handles string values. This is basically a noop.
 */
export const StringParser: IAttributeParser<string> = {
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
