/**
 * Utility methods to work with typescript's enums.
 */

/**
 * Converts enum name (as lower case string) to the corresponding enum value.
 *
 * @param stringValue The string value to convert to enum value.
 * @param enumSet The set of enum values.
 * @return The enum value corresponding to the enum name.
 */
export function fromLowerCaseString<E>(stringValue: string, enumSet: any): E {
  return enumSet[stringValue.toUpperCase()];
}

/**
 * Converts enum number (as string) to the corresponding enum value.
 *
 * @param stringValue The number to convert to enum value.
 * @param enumSet The set of enum values.
 * @return The enum value corresponding to the enum number.
 */
export function fromNumberString<E>(stringValue: string, enumSet: any): E {
  const nameString: string = enumSet[stringValue];

  return enumSet[nameString] as E;
}

/**
 * Returns all values of the given enum.
 *
 * @param enumSet Enum whose values should be returned.
 * @return Array of enum values.
 */
export function getAllValues<E>(enumSet: any): E[] {
  const values: E[] = [];
  for (const key in enumSet) {
    if (isNaN(Number(key))) {
      values.push(enumSet[key]);
    }
  }

  return values;
}

/**
 * Converts the given enum value to lower case version of its name.
 *
 * @param enumValue The enum value to convert.
 * @param enumSet The set of enum values.
 * @return The lower case version of the enum name that corresponds to the enum value.
 */
export function toLowerCaseString(enumValue: any, enumSet: any): string {
  return enumSet[enumValue].toLowerCase();
}
