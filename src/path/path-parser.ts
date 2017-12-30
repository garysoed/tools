import { Parser } from '../interfaces';
import { AbsolutePathParser } from '../path/absolute-path-parser';
import { Path } from '../path/path';
import { RelativePathParser } from '../path/relative-path-parser';

export const PathParser: Parser<Path> = {
  parse(input: string | null): Path | null {
    return RelativePathParser.parse(input) || AbsolutePathParser.parse(input);
  },

  stringify(value: Path | null): string {
    if (!value) {
      return '';
    }

    return value.toString();
  },
};
