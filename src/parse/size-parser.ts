import { Size, UNITS } from '../interfaces/size';
import { FloatParser } from '../parse/float-parser';
import { Parser } from './parser';

export const SizeParser: Parser<Size> = {
  convertBackward(input: string | null): Size | null {
    if (!input) {
      return null;
    }

    const unit = UNITS.find(unit => input.endsWith(unit));
    const unitLength = unit ? unit.length : 0;
    const size = input.substr(0, input.length - unitLength);
    const parsedSize = FloatParser.convertBackward(size);
    if (parsedSize === null) {
      return null;
    }

    return {
      unit: unit || 'pt',
      value: parsedSize,
    };
  },

  convertForward(value: Size | null): string {
    if (!value) {
      return '';
    }

    return `${FloatParser.convertForward(value.value)}${value.unit}`;
  },
};
