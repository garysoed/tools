import { Converter, Result } from 'nabu/export/main';
import { firstSuccess } from 'nabu/export/util';
import { absolutePathParser } from '../path/absolute-path-parser';
import { Path } from '../path/path';
import { relativePathParser } from '../path/relative-path-parser';

class PathParser implements Converter<Path, string> {
  convertBackward(value: string): Result<Path> {
    return firstSuccess(relativePathParser(), absolutePathParser()).convertBackward(value);
  }

  convertForward(input: Path): Result<string> {
    return {result: input.toString(), success: true};
  }
}

export function pathParser(): Converter<Path, string> {
  return new PathParser();
}
