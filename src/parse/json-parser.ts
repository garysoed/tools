import { Parser } from './parser';

export function JsonParser<T extends {}>(): Parser<T> {
  return {
    convertBackward(input: string|null): T|null {
      if (input === null || input === '') {
        return null;
      }

      return JSON.parse(input);
    },

    convertForward(value: T|null): string {
      if (value === null) {
        return '';
      }

      return JSON.stringify(value);
    },
  };
}
