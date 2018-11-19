import { ImmutableList } from '../immutable';
import { Parser } from '../parse/parser';
import { AbsolutePath } from '../path/absolute-path';
import { Path } from '../path/path';

export const AbsolutePathParser: Parser<AbsolutePath> = {
  convertBackward(input: string | null): AbsolutePath | null {
    if (!input) {
      return null;
    }

    const parts = input.split(Path.SEPARATOR);

    if (parts[0] !== '') {
      // This is not an absolute path.
      return null;
    }

    return new AbsolutePath(ImmutableList.of(parts.slice(1)));
  },

  convertForward(value: AbsolutePath | null): string {
    if (!value) {
      return '';
    }

    return value.toString();
  },
};
