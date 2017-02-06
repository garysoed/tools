import {FloatParser} from './float-parser';
import {IAttributeParser} from './interfaces';

export const IntegerParser: IAttributeParser<number> = {
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
