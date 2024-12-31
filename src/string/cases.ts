const CAMEL_CASE_REGEX = /^[a-z][a-zA-Z0-9]*$/;
const LOWER_CASE_REGEX = /^[a-z][a-z0-9-]*$/;
const PASCAL_CASE_REGEX = /^[A-Z][a-zA-Z0-9]*$/;
const UPPER_CASE_REGEX = /^[A-Z][A-Z0-9_]*$/;

/**
 * Utility class to convert between different capitalization styles.
 */
class Cases {
  constructor(private readonly words: readonly string[]) {}

  /**
   * Converts to camelCase.
   *
   * @return The camel case version of the string.
   */
  toCamelCase(): string {
    return this.words
      .map((value, index) => {
        if (index === 0) {
          return value;
        } else {
          const [firstLetter, ...rest] = value;
          if (firstLetter === undefined) {
            return '';
          }
          return `${firstLetter.toUpperCase()}${rest.join('')}`;
        }
      })
      .join('');
  }
  /**
   * Converts to lower-case.
   *
   * @return The lower case version of the string.
   */
  toLowerCase(): string {
    return this.words.join('-');
  }
  /**
   * Converts to PascalCase.
   *
   * @return The pascal case version of the string.
   */
  toPascalCase(): string {
    return this.words
      .map((value) => {
        const [firstLetter, ...rest] = value;
        if (firstLetter === undefined) {
          return '';
        }
        return `${firstLetter.toUpperCase()}${rest.join('')}`;
      })
      .join('');
  }
  /**
   * Converts to UPPER_CASE.
   *
   * @return The upper case version of the string.
   */
  toUpperCase(): string {
    return this.words.map((value) => value.toUpperCase()).join('_');
  }
}

/**
 * Starting point of the case conversion.
 *
 * @return Cases object to chain the conversion.
 */
export function convertCaseFrom(input: string): Cases {
  let words: string[];
  if (CAMEL_CASE_REGEX.test(input)) {
    words = input
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map((word) => word.toLowerCase());
  } else if (PASCAL_CASE_REGEX.test(input)) {
    const [firstLetter, ...rest] = input;
    if (firstLetter === undefined) {
      words = [];
    } else {
      const normalizedInput = `${firstLetter.toLowerCase()}${rest.join('')}`;
      words = normalizedInput
        .replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map((word) => word.toLowerCase());
    }
  } else if (LOWER_CASE_REGEX.test(input)) {
    words = input.split('-');
  } else if (UPPER_CASE_REGEX.test(input)) {
    words = input.split('_').map((word) => word.toLowerCase());
  } else {
    words = input.split(' ').map((word) => word.toLowerCase());
  }

  return new Cases(words);
}

export function convertCaseAtomFrom(atom: string): Cases {
  return new Cases([atom]);
}
