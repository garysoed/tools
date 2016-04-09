/**
 * String related assertions.
 */
class StringAsserts {
  /**
   * Assert that the given string is not empty.
   *
   * @param value The string to check.
   * @param message Error message to throw when empty. Defaults to `<value> should not be empty`.
   */
  static isNotEmpty(value: string, message: string = `${value} should not be empty`): void {
    if (value.length === 0) {
      throw Error(message);
    }
  }
}

export default StringAsserts;
