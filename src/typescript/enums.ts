/**
 * Utility methods to work with typescript's enums.
 */
export class Enums {
  /**
   * Converts enum number (as string) to the corresponding enum value.
   *
   * @param stringValue The number to convert to enum value.
   * @param enumSet The set of enum values.
   * @return The enum value corresponding to the enum number.
   */
  static fromNumberString<E>(stringValue: string, enumSet: gs.IEnum): E {
    let nameString: string = enumSet[stringValue];
    return enumSet[nameString];
  }

  /**
   * Converts enum name (as lower case string) to the corresponding enum value.
   *
   * @param stringValue The string value to convert to enum value.
   * @param enumSet The set of enum values.
   * @return The enum value corresponding to the enum name.
   */
  static fromLowerCaseString<E>(stringValue: string, enumSet: gs.IEnum): E {
    return enumSet[stringValue.toUpperCase()];
  }

  /**
   * Converts the given enum value to lower case version of its name.
   *
   * @param enumValue The enum value to convert.
   * @param enumSet The set of enum values.
   * @return The lower case version of the enum name that corresponds to the enum value.
   */
  static toLowerCaseString(enumValue: any, enumSet: gs.IEnum): string {
    return enumSet[enumValue].toLowerCase();
  }
};
