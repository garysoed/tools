import { Enums } from '../typescript/enums';
import { Parser } from './parser';

/**
 * Represents an enum.
 */
interface Enum {
  [key: number]: string;
}

export class EnumParserImpl<E> implements Parser<E> {
  private readonly enumSet_: Enum;

  /**
   * @param enumType Type of enum to parse into.
   */
  constructor(enumType: Enum) {
    this.enumSet_ = enumType;
  }

  convertBackward(input: string | null): E | null {
    if (input === null) {
      return null;
    }

    const result = Enums.fromLowerCaseString<E>(input, this.enumSet_);

    return result === undefined ? null : result;
  }

  convertForward(value: E): string {
    return Enums.toLowerCaseString(value, this.enumSet_);
  }
}

/**
 * Creates an enum parser.
 * @param enumType Type of enum to parse into.
 * @param <E> Type of enum to parse into.
 * @return The enum parser.
 */
export function EnumParser<E>(enumType: Enum): EnumParserImpl<E> {
  return new EnumParserImpl<E>(enumType);
}
