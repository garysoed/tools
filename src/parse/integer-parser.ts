import { FloatParser } from './float-parser';
import { Parser } from './parser';

export const IntegerParser: Parser<number> = {
  convertBackward(input: string | null): number|null {
    const float = FloatParser.convertBackward(input);
    if (float === null) {
      return null;
    }

    return Math.round(float);
  },

  convertForward(value: number|null): string|null {
    if (value === null) {
      return null;
    }

    return FloatParser.convertForward(Math.round(value));
  },
};
