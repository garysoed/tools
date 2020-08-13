import { Path } from '../path/path';

export class AbsolutePath extends Path {
  toString(): string {
    return `/${this.getParts().join(Path.SEPARATOR)}`;
  }
}
