export interface Parser<T> {
  /**
   * Parses the input string.
   *
   * @param input The input string to parse.
   * @return The parsed input string, or null if the parse did not succeed.
   */
  parse(input: string | null): T | null;

  /**
   * Converts the given value to string.
   *
   * @param value The value to be converted to string.
   * @return The string representation of the input value.
   */
  stringify(value: T | null): string;
}
