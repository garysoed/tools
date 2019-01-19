import { cache } from '../data/cache';
import { Path } from '../path/path';

export class RelativePath extends Path {
  @cache()
  toString(): string {
    return `${[...this.getParts()()].join(Path.SEPARATOR)}`;
  }
}
