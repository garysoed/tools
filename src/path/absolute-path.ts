import { Path, SEPARATOR } from '../path/path';

/**
 * Path that is an absolute path.
 *
 * @thModule path
 */
export class AbsolutePath extends Path {
  /**
   * String representation of the path.
   *
   * @returns String representation of the absolute path.
   */
  toString(): string {
    return `/${this.parts.join(SEPARATOR)}`;
  }
}
