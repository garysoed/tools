import { FloatParser } from '../parse/float-parser';
import { Parser } from './parser';

export const IntegerParser: Parser<number> = {
  parse(input: string | null): number | null {
    const float = FloatParser.parse(input);
    if (float === null) {
      return null;
    }

    return Math.round(float);
  },

  stringify(value: number): string {
    return FloatParser.stringify(Math.round(value));
  },
};
