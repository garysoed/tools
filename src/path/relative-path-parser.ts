import { ImmutableList } from '../immutable';
import { Parser } from '../parse/parser';
import { Path } from '../path/path';
import { RelativePath } from '../path/relative-path';

export const RelativePathParser: Parser<RelativePath> = {
  convertBackward(input: string | null): RelativePath | null {
    if (!input) {
      return null;
    }

    const parts = input.split(Path.SEPARATOR);

    if (parts[0] === '') {
      // This is an abolute path.
      return null;
    }

    return new RelativePath(ImmutableList.of(parts));
  },

  convertForward(value: RelativePath | null): string {
    if (!value) {
      return '';
    }

    return value.toString();
  },
};
