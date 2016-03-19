export default {
  fromNumberString<E>(stringValue: string, enumSet: gs.IEnum): E {
    let nameString: string = enumSet[stringValue];
    return enumSet[nameString];
  },

  fromLowerCaseString<E>(stringValue: string, enumSet: gs.IEnum): E {
    return enumSet[stringValue.toUpperCase()];
  },

  toLowerCaseString(enumValue: number, enumSet: gs.IEnum): string {
    return enumSet[enumValue].toLowerCase();
  },
};
