/**
 * Utility class to convert between different capitalization styles.
 */
import { ImmutableList } from '../immutable/immutable-list';

export class Cases {
  private static CAMEL_CASE_REGEX_: RegExp = /^[a-z][a-zA-Z0-9]*$/;
  private static LOWER_CASE_REGEX_: RegExp = /^[a-z][a-z0-9\-]*$/;
  private static PASCAL_CASE_REGEX_: RegExp = /^[A-Z][a-zA-Z0-9]*$/;
  private static UPPER_CASE_REGEX_: RegExp = /^[A-Z][A-Z0-9_]*$/;

  constructor(private words_: ImmutableList<string>) {}

  /**
   * Converts to camelCase.
   *
   * @return The camel case version of the string.
   */
  toCamelCase(): string {
    return this.words_
        .map((value: string, index: number) => {
          if (index === 0) {
            return value;
          } else {
            return `${value[0].toUpperCase()}${value.substring(1)}`;
          }
        })
        .toArray()
        .join('');
  }

  /**
   * Converts to lower-case.
   *
   * @return The lower case version of the string.
   */
  toLowerCase(): string {
    return this.words_.toArray().join('-');
  }

  /**
   * Converts to PascalCase.
   *
   * @return The pascal case version of the string.
   */
  toPascalCase(): string {
    return this.words_
        .map((value: string) => {
          return `${value[0].toUpperCase()}${value.substring(1)}`;
        })
        .toArray()
        .join('');
  }

  /**
   * Converts to UPPER_CASE.
   *
   * @return The upper case version of the string.
   */
  toUpperCase(): string {
    return this.words_
        .map((value: string) => {
          return value.toUpperCase();
        })
        .toArray()
        .join('_');
  }

  /**
   * Starting point of the case conversion.
   *
   * @return Cases object to chain the conversion.
   */
  static of(input: string): Cases {
    let words: ImmutableList<string>;
    if (Cases.CAMEL_CASE_REGEX_.test(input)) {
      words = ImmutableList
          .of(input.replace(/([A-Z])/g, ' $1').split(' '))
          .map((word: string) => {
            return word.toLowerCase();
          });
    } else if (Cases.PASCAL_CASE_REGEX_.test(input)) {
      const normalizedInput = `${input[0].toLowerCase()}${input.substring(1)}`;
      words = ImmutableList
          .of(normalizedInput.replace(/([A-Z])/g, ' $1').split(' '))
          .map((word: string) => {
            return word.toLowerCase();
          });
    } else if (Cases.LOWER_CASE_REGEX_.test(input)) {
      words = ImmutableList.of(input.split('-'));
    } else if (Cases.UPPER_CASE_REGEX_.test(input)) {
      words = ImmutableList
          .of(input.split('_'))
          .map((word: string) => {
            return word.toLowerCase();
          });
    } else {
      words = ImmutableList
          .of(input.split(' '))
          .map((word: string) => {
            return word.toLowerCase();
          });
    }
    return new Cases(words);
  }
}
