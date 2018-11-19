import { Parser } from '../parse/parser';
import { AbsolutePathParser } from '../path/absolute-path-parser';
import { Path } from '../path/path';
import { RelativePathParser } from '../path/relative-path-parser';

export const PathParser: Parser<Path> = {
  convertBackward(input: string | null): Path | null {
    return RelativePathParser.convertBackward(input) || AbsolutePathParser.convertBackward(input);
  },

  convertForward(value: Path | null): string {
    if (!value) {
      return '';
    }

    return value.toString();
  },
};
