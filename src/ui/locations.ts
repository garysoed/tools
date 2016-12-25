import {Arrays} from '../collection/arrays';


export class Locations {
  private static MATCHER_REGEXP_: RegExp = /:([^:\/]+)/;

  /**
   * @return Parts of the given path.
   */
  private static getParts_(path: string): string[] {
    return Arrays
        .of(Locations.normalizePath(path).split('/'))
        .filter((part: string) => {
          return part !== '.';
        })
        .asArray();
  }

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
  static getMatches(path: string, matcher: string): {[key: string]: string} | null {
    let exactMatch = false;
    if (matcher[matcher.length - 1] === '$') {
      matcher = matcher.substr(0, matcher.length - 1);
      exactMatch = true;
    }
    let hashParts = Locations.getParts_(path);
    let matcherParts = Locations.getParts_(matcher);

    if (exactMatch && matcherParts.length !== hashParts.length) {
      return null;
    }

    let matches = {};
    for (let i = 0; i < matcherParts.length; i++) {
      let matchPart = matcherParts[i];
      let hashPart = hashParts[i];

      let matcherResult = Locations.MATCHER_REGEXP_.exec(matchPart);

      if (matcherResult !== null) {
        matches[matcherResult[1]] = hashPart;
      } else if (hashPart !== matchPart) {
        return null;
      }
    }

    return matches;
  }

  /**
   * @return The normalized path. This makes sure that every part starts with a '/' and does not end
   *    with a '/'.
   */
  static normalizePath(path: string): string {
    path = path[0] === '/' ? path : '/' + path;
    return path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path;
  }
};
