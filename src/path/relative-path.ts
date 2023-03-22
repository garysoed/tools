import {Path, SEPARATOR} from '../path/path';

export class RelativePath extends Path {
  override toString(): string {
    return `${this.parts.join(SEPARATOR)}`;
  }
}
