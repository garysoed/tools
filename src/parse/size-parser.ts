import { Parser } from '../interfaces/parser';
import { FloatParser } from '../parse/float-parser';

type Unit =
  'cap' |
  'ch' |
  'cm' |
  'em' |
  'ex' |
  'ic' |
  'in' |
  'lh' |
  'mm' |
  'pc' |
  'pt' |
  'px' |
  'q' |
  'rem' |
  'rlh' |
  'vb' |
  'vh' |
  'vi' |
  'vmin' |
  'vmax' |
  'vw';
type Size = {unit: Unit, value: number};

const UNITS: Unit[] = [
  'cap',
  'ch',
  'cm',
  'em',
  'ex',
  'ic',
  'in',
  'lh',
  'mm',
  'pc',
  'pt',
  'px',
  'q',
  'rem',
  'rlh',
  'vb',
  'vh',
  'vi',
  'vmin',
  'vmax',
  'vw',
];

export const SizeParser: Parser<Size> = {
  parse(input: string | null): Size | null {
    if (!input) {
      return null;
    }

    const unit = UNITS.find((unit) => input.endsWith(unit));
    const unitLength = unit ? unit.length : 0;
    const size = input.substr(0, input.length - unitLength);
    const parsedSize = FloatParser.parse(size);
    if (!parsedSize) {
      return null;
    }

    return {
      unit: unit || 'pt',
      value: parsedSize,
    };
  },

  stringify(value: Size | null): string {
    if (!value) {
      return '';
    }
    return `${FloatParser.stringify(value.value)}${value.unit}`;
  },
};
