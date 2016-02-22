export default {
  fromLowerCaseString<E>(stringValue: string, enumSet: gs.IEnum): E {
    return enumSet[stringValue.toUpperCase()];
  },

  toLowerCaseString(enumValue: number, enumSet: gs.IEnum): string {
    return enumSet[enumValue].toLowerCase();
  },
};
