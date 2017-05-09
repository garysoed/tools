import { Parser } from '../interfaces/parser';
import { FloatParser } from '../parse/float-parser';

export const IntegerParser: Parser<number> = {
  /**
   * @override
   */
  parse(input: string | null): number | null {
    const float = FloatParser.parse(input);
    if (float === null) {
      return null;
    }

    return Math.round(float);
  },

  /**
   * @override
   */
  stringify(value: number): string {
    return FloatParser.stringify(Math.round(value));
  },
};
// TODO: Mutable
