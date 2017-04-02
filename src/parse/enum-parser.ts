import { Parser } from '../interfaces/parser';
import { Enums } from '../typescript/enums';


export class EnumParserImpl<E> implements Parser<E> {
  private readonly enumSet_: gs.IEnum;

  /**
   * @param enumType Type of enum to parse into.
   */
  constructor(enumType: gs.IEnum) {
    this.enumSet_ = enumType;
  }

  /**
   * @override
   */
  parse(input: string | null): E | null {
    if (input === null) {
      return null;
    }

    let result = Enums.fromLowerCaseString<E>(input, this.enumSet_);
    return result === undefined ? null : result;
  }

  /**
   * @override
   */
  stringify(value: E): string {
    return Enums.toLowerCaseString(value, this.enumSet_);
  }
}

/**
 * Creates an enum parser.
 * @param enumType Type of enum to parse into.
 * @param <E> Type of enum to parse into.
 * @return The enum parser.
 */
export function EnumParser<E>(enumType: gs.IEnum): EnumParserImpl<E> {
  return new EnumParserImpl<E>(enumType);
};
