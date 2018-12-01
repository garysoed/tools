import { Converter, Result } from 'nabu/export/main';
import { ImmutableList } from '../immutable';
import { Path } from '../path/path';
import { RelativePath } from '../path/relative-path';

class RelativePathParser implements Converter<RelativePath, string> {
  convertBackward(input: string): Result<RelativePath> {
    if (!input) {
      return {success: false};
    }

    const parts = input.split(Path.SEPARATOR);

    if (parts[0] === '') {
      // This is an abolute path.
      return {success: false};
    }

    return {result: new RelativePath(ImmutableList.of(parts)), success: true};
  }

  convertForward(input: RelativePath): Result<string> {
    return {result: input.toString(), success: true};
  }
}

export function relativePathParser(): RelativePathParser {
  return new RelativePathParser();
}
