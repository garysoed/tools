/**
 * Utilities to work with native types.
 */
export class Natives {
  /**
   * @param value Value to be checked.
   * @return True iff the value is a boolean.
   */
  static isBoolean(value: any): value is boolean {
    return typeof value === 'boolean' || value instanceof Boolean;
  }

  /**
   * @param value Value to be checked.
   * @return True iff the given value is a native value.
   */
  static isNative(value: any): value is boolean | number | string | symbol {
    return Natives.isBoolean(value)
        || Natives.isNumber(value)
        || Natives.isString(value)
        || Natives.isSymbol(value);
  }

  /**
   * @param value Value to be checked.
   * @return True iff the given value is a number.
   */
  static isNumber(value: any): value is number {
    return typeof value === 'number' || value instanceof Number;
  }

  /**
   * @param value Value to be checked.
   * @return True iff the value is a string.
   */
  static isString(value: any): value is string {
    return typeof value === 'string' || value instanceof String;
  }

  /**
   * @param value Value to be checked.
   * @return True iff the value is a symbol.
   */
  static isSymbol(value: any): value is symbol {
    return typeof value === 'symbol';
  }
}
