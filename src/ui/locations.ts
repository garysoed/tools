import { pipe } from '../collect/pipe';
import { filter } from '../collect/operators/filter';
import { head } from '../collect/operators/head';
import { size } from '../collect/operators/size';
import { skip } from '../collect/operators/skip';
import { asImmutableList, createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { createImmutableMap, ImmutableMap } from '../collect/types/immutable-map';


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
export function getMatches(path: string, matcher: string): ImmutableMap<string, string> | null {
  let exactMatch = false;

  let trimmedMatcher = matcher;
  if (matcher[matcher.length - 1] === '$') {
    trimmedMatcher = matcher.substr(0, matcher.length - 1);
    exactMatch = true;
  }
  const hashParts = getParts_(path);
  const matcherParts = getParts_(trimmedMatcher);

  if (exactMatch && pipe(matcherParts, size()) !== pipe(hashParts, size())) {
    return null;
  }

  const matches = new Map<string, string>();
  for (let i = 0; i < pipe(matcherParts, size()); i++) {
    const matchPart = pipe(matcherParts, skip(i), head<string>());
    if (matchPart === undefined) {
      return null;
    }

    const hashPart = pipe(hashParts, skip(i), head<string>());
    if (hashPart === undefined) {
      return null;
    }

    const matcherResult = MATCHER_REGEXP_.exec(matchPart);

    if (matcherResult !== null) {
      matches.set(matcherResult[1], hashPart);
    } else if (hashPart !== matchPart) {
      return null;
    }
  }

  return createImmutableMap(matches);
}

/**
 * @return Parts of the given path.
 */
export function getParts_(path: string): ImmutableList<string> {
  return pipe(
      createImmutableList(normalizePath(path).split('/')),
      filter(part => part !== '.'),
      asImmutableList(),
  );
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
