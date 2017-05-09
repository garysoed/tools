import { Arrays } from '../collection/arrays';


/**
 * Utility class to convert between different capitalization styles.
 */
export class Cases {
  private static CAMEL_CASE_REGEX_: RegExp = /^[a-z][a-zA-Z0-9]*$/;
  private static LOWER_CASE_REGEX_: RegExp = /^[a-z][a-z0-9\-]*$/;
  private static PASCAL_CASE_REGEX_: RegExp = /^[A-Z][a-zA-Z0-9]*$/;
  private static UPPER_CASE_REGEX_: RegExp = /^[A-Z][A-Z0-9_]*$/;

  constructor(private words_: string[]) {}

  /**
   * Converts to camelCase.
   *
   * @return The camel case version of the string.
   */
  toCamelCase(): string {
    return Arrays.of(this.words_)
        .mapElement((value: string, index: number) => {
          if (index === 0) {
            return value;
          } else {
            return `${value[0].toUpperCase()}${value.substring(1)}`;
          }
        })
        .asArray()
        .join('');
  }

  /**
   * Converts to lower-case.
   *
   * @return The lower case version of the string.
   */
  toLowerCase(): string {
    return this.words_.join('-');
  }

  /**
   * Converts to PascalCase.
   *
   * @return The pascal case version of the string.
   */
  toPascalCase(): string {
    return Arrays.of(this.words_)
        .map((value: string) => {
          return `${value[0].toUpperCase()}${value.substring(1)}`;
        })
        .asArray()
        .join('');
  }

  /**
   * Converts to UPPER_CASE.
   *
   * @return The upper case version of the string.
   */
  toUpperCase(): string {
    return Arrays.of(this.words_)
        .map((value: string) => {
          return value.toUpperCase();
        })
        .asArray()
        .join('_');
  }

  /**
   * Starting point of the case conversion.
   *
   * @return Cases object to chain the conversion.
   */
  static of(input: string): Cases {
    let words;
    if (Cases.CAMEL_CASE_REGEX_.test(input)) {
      words = Arrays.of(input.replace(/([A-Z])/g, ' $1').split(' '))
          .map((word: string) => {
            return word.toLowerCase();
          })
          .asArray();
    } else if (Cases.PASCAL_CASE_REGEX_.test(input)) {
      const normalizedInput = `${input[0].toLowerCase()}${input.substring(1)}`;
      words = Arrays.of(normalizedInput.replace(/([A-Z])/g, ' $1').split(' '))
          .map((word: string) => {
            return word.toLowerCase();
          })
          .asArray();
    } else if (Cases.LOWER_CASE_REGEX_.test(input)) {
      words = input.split('-');
    } else if (Cases.UPPER_CASE_REGEX_.test(input)) {
      words = Arrays.of(input.split('_'))
          .map((word: string) => {
            return word.toLowerCase();
          })
          .asArray();
    } else {
      words = Arrays
          .of(input.split(' '))
          .map((word: string) => {
            return word.toLowerCase();
          })
          .asArray();
    }
    return new Cases(words);
  }
}
// TODO: Mutable
