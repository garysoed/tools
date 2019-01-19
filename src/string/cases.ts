import { exec } from '../collect/exec';
import { countable } from '../collect/generators';
import { map } from '../collect/operators/map';
import { zip } from '../collect/operators/zip';
import { createImmutableList, ImmutableList } from '../collect/types/immutable-list';

/**
 * Utility class to convert between different capitalization styles.
 */
export class Cases {
  private static CAMEL_CASE_REGEX_: RegExp = /^[a-z][a-zA-Z0-9]*$/;
  private static LOWER_CASE_REGEX_: RegExp = /^[a-z][a-z0-9\-]*$/;
  private static PASCAL_CASE_REGEX_: RegExp = /^[A-Z][a-zA-Z0-9]*$/;
  private static UPPER_CASE_REGEX_: RegExp = /^[A-Z][A-Z0-9_]*$/;

  constructor(private words: ImmutableList<string>) {}

  /**
   * Converts to camelCase.
   *
   * @return The camel case version of the string.
   */
  toCamelCase(): string {
    const list = exec(
            this.words,
            zip(countable()),
            map(([value, index]) => {
              if (index === 0) {
                return value;
              } else {
                return `${value[0].toUpperCase()}${value.substring(1)}`;
              }
            }),
        );

    return [...list()].join('');
  }

  /**
   * Converts to lower-case.
   *
   * @return The lower case version of the string.
   */
  toLowerCase(): string {
    return [...this.words()].join('-');
  }

  /**
   * Converts to PascalCase.
   *
   * @return The pascal case version of the string.
   */
  toPascalCase(): string {
    const list = exec(
        this.words,
        map((value: string) => {
          return `${value[0].toUpperCase()}${value.substring(1)}`;
        }));

    return [...list()].join('');
  }

  /**
   * Converts to UPPER_CASE.
   *
   * @return The upper case version of the string.
   */
  toUpperCase(): string {
    const list = exec(
        this.words,
        map((value: string) => {
          return value.toUpperCase();
        }));

    return [...list()].join('_');
  }

  /**
   * Starting point of the case conversion.
   *
   * @return Cases object to chain the conversion.
   */
  static of(input: string): Cases {
    let words: Iterable<string>;
    if (Cases.CAMEL_CASE_REGEX_.test(input)) {
      words = exec(
          createImmutableList(input.replace(/([A-Z])/g, ' $1').split(' ')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    } else if (Cases.PASCAL_CASE_REGEX_.test(input)) {
      const normalizedInput = `${input[0].toLowerCase()}${input.substring(1)}`;
      words = exec(
          createImmutableList(normalizedInput.replace(/([A-Z])/g, ' $1').split(' ')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    } else if (Cases.LOWER_CASE_REGEX_.test(input)) {
      words = input.split('-');
    } else if (Cases.UPPER_CASE_REGEX_.test(input)) {
      words = exec(
          createImmutableList(input.split('_')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    } else {
      words = exec(
          createImmutableList(input.split(' ')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    }

    return new Cases(createImmutableList([...words]));
  }
}
