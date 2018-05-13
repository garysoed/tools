import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';


export class Locations {
  private static readonly MATCHER_REGEXP_: RegExp = /:([^:\/]+)/;

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
  static getMatches(path: string, matcher: string): ImmutableMap<string, string> | null {
    let exactMatch = false;
    if (matcher[matcher.length - 1] === '$') {
      matcher = matcher.substr(0, matcher.length - 1);
      exactMatch = true;
    }
    const hashParts = Locations.getParts_(path);
    const matcherParts = Locations.getParts_(matcher);

    if (exactMatch && matcherParts.size() !== hashParts.size()) {
      return null;
    }

    const matches = {};
    for (let i = 0; i < matcherParts.size(); i++) {
      const matchPart = matcherParts.getAt(i)!;
      const hashPart = hashParts.getAt(i);

      const matcherResult = Locations.MATCHER_REGEXP_.exec(matchPart);

      if (matcherResult !== null) {
        matches[matcherResult[1]] = hashPart;
      } else if (hashPart !== matchPart) {
        return null;
      }
    }

    return ImmutableMap.of(matches);
  }

  /**
   * @return Parts of the given path.
   */
  static getParts_(path: string): ImmutableList<string> {
    return ImmutableList.of(Locations.normalizePath(path).split('/'))
        .filter((part: string) => {
          return part !== '.';
        });
  }

  /**
   * @return The normalized path. This makes sure that every part starts with a '/' and does not end
   *    with a '/'.
   */
  static normalizePath(path: string): string {
    path = path[0] === '/' ? path : `/${path}`;
    return path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path;
  }
}
