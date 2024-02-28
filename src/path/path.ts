/**
 * Represents a path.
 *
 * @thModule path
 */
export abstract class Path {
  constructor(
    /**
     * Parts of the path.
     */
    readonly parts: readonly string[],
  ) {}
}

/**
 * Separator between path parts.
 *
 * @thHidden
 */
export const SEPARATOR = '/';
