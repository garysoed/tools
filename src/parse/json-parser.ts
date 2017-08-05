import { Parser } from '../interfaces/parser';

export const JsonParser: Parser<gs.IJson> = {
  parse(input: string | null): gs.IJson | null {
    if (input === null || input === '') {
      return null;
    }

    return JSON.parse(input);
  },

  stringify(value: gs.IJson | null): string {
    if (value === null) {
      return '';
    }

    return JSON.stringify(value);
  },
};
