import { countable } from '../collection/generators';
import { map } from '../collection/operators/map';
import { zip } from '../collection/operators/zip';
import { pipe } from '../collection/pipe';
import { createImmutableList, ImmutableList } from '../collection/types/immutable-list';

const CAMEL_CASE_REGEX: RegExp = /^[a-z][a-zA-Z0-9]*$/;
const LOWER_CASE_REGEX: RegExp = /^[a-z][a-z0-9\-]*$/;
const PASCAL_CASE_REGEX: RegExp = /^[A-Z][a-zA-Z0-9]*$/;
const UPPER_CASE_REGEX: RegExp = /^[A-Z][A-Z0-9_]*$/;

/**
 * Utility class to convert between different capitalization styles.
 */
export class Cases {

  constructor(private readonly words: ImmutableList<string>) {}

  /**
   * Converts to camelCase.
   *
   * @return The camel case version of the string.
   */
  toCamelCase(): string {
    const list = pipe(
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
    const list = pipe(
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
    const list = pipe(
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
    if (CAMEL_CASE_REGEX.test(input)) {
      words = pipe(
          createImmutableList(input.replace(/([A-Z])/g, ' $1').split(' ')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    } else if (PASCAL_CASE_REGEX.test(input)) {
      const normalizedInput = `${input[0].toLowerCase()}${input.substring(1)}`;
      words = pipe(
          createImmutableList(normalizedInput.replace(/([A-Z])/g, ' $1').split(' ')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    } else if (LOWER_CASE_REGEX.test(input)) {
      words = input.split('-');
    } else if (UPPER_CASE_REGEX.test(input)) {
      words = pipe(
          createImmutableList(input.split('_')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    } else {
      words = pipe(
          createImmutableList(input.split(' ')),
          map((word: string) => {
            return word.toLowerCase();
          }),
      )();
    }

    return new Cases(createImmutableList([...words]));
  }
}
