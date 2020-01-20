const MATCHER_REGEXP_: RegExp = /:([^:\/]+)/;

/**
 * Retrieves matches from the current path.
 *
 * This method takes in a matcher, which is a string that looks like a path. If parts of the path
 * is of format `:name`, this method will include the value of that part of the path in the hash
 * in the returned object. For example, the matching string `/:a/_/:b` will match the hash path
 * `/hello/_/location` and returns the object `{a: 'hello', b: 'location'}`.
 *
 * @param path The path to get the matches from.
 * @param matcher The matcher string.
 * @return Object containing the matches if it matches, or null otherwise.
 */
export function getMatches(path: string, matcher: string): ReadonlyMap<string, string>|null {
  let exactMatch = false;

  let trimmedMatcher = matcher;
  if (matcher[matcher.length - 1] === '$') {
    trimmedMatcher = matcher.substr(0, matcher.length - 1);
    exactMatch = true;
  }
  const hashParts = getParts_(path);
  const matcherParts = getParts_(trimmedMatcher);

  if (exactMatch && matcherParts.length !== hashParts.length) {
    return null;
  }

  const matches = new Map<string, string>();
  for (let i = 0; i < matcherParts.length; i++) {
    const matchPart = matcherParts[i];
    const hashPart = hashParts[i];

    const matcherResult = MATCHER_REGEXP_.exec(matchPart);

    if (matcherResult !== null) {
      matches.set(matcherResult[1], hashPart);
    } else if (hashPart !== matchPart) {
      return null;
    }
  }

  return matches;
}

/**
 * @return Parts of the given path.
 */
export function getParts_(path: string): readonly string[] {
  return normalizePath(path).split('/').filter(part => part !== '.');
}

/**
 * @return The normalized path. This makes sure that every part starts with a '/' and does not end
 *    with a '/'.
 */
export function normalizePath(path: string): string {
  const preNormalizedPath = path[0] === '/' ? path : `/${path}`;

  return preNormalizedPath[preNormalizedPath.length - 1] === '/' ?
      preNormalizedPath.substr(0, preNormalizedPath.length - 1) : preNormalizedPath;
}
