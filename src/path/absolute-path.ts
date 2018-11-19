import { cache } from '../data/cache';
import { Path } from '../path/path';

export class AbsolutePath extends Path {
  @cache()
  toString(): string {
    return `/${[...this.getParts()].join(Path.SEPARATOR)}`;
  }
}
