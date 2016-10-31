import {IAttributeParser} from './interfaces';


/**
 * Attribute parser that handles boolean values.
 */
export const BooleanParser: IAttributeParser<boolean> = {
  /**
   * Parses the given input string.
   *
   * @param input The input string.
   * @return The parsed boolean value.
   */
  parse(input: string| null): boolean {
    return input !== null && input.toLowerCase() !== 'false';
  },

  /**
   * Converts the given value to string.
   *
   * @param value The boolean value to be converted to string.
   * @return The string representation of the boolean value.
   */
  stringify(value: boolean): string {
    return value ? 'true' : 'false';
  },
};
