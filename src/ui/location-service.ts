import {Arrays} from '../collection/arrays';
import {BaseListenable} from '../event/base-listenable';
import {DomEvent} from '../event/dom-event';
import {ListenableDom} from '../event/listenable-dom';
import {LocationServiceEvents} from './location-service-events';
import {Reflect} from '../util/reflect';


/**
 * Service to manage location on a page.
 *
 * This only uses the location's hash.
 */
export class LocationService extends BaseListenable<LocationServiceEvents> {
  private static MATCHER_REGEXP: RegExp = /:([^:\/]+)/;

  private location_: Location;
  private window_: ListenableDom<Window>;

  /**
   * @param window Reference to the window object.
   */
  constructor(window: ListenableDom<Window>) {
    super();

    this.location_ = window.getEventTarget().location;
    this.window_ = window;

    this.addDisposable(this.window_);
  }

  /**
   * Initializes the given LocationService instance.
   * @param service The service instance to be initialized.
   * @static
   */
  private static [Reflect.__initialize](service: LocationService): void {
    service.init_();
  }

  /**
   * @return Parts of the given path.
   */
  private getParts_(path: string): string[] {
    return Arrays
        .of(LocationService.normalizePath(path).split('/'))
        .filter((part: string) => {
          return part !== '.';
        })
        .asArray();
  }

  /**
   * Initializes the service.
   */
  private init_(): void {
    this.window_.on(DomEvent.HASHCHANGE, this.onHashChange_.bind(this));
  }

  /**
   * Handles event when the hash has been changed.
   */
  private onHashChange_(): void {
    this.dispatch(LocationServiceEvents.CHANGED);
  }

  /**
   * Retrieves matches from the current path.
   *
   * This method takes in a matcher, which is a string that looks like a path. If parts of the path
   * is of format `:name`, this method will include the value of that part of the path in the hash
   * in the returned object. For example, the matching string `/:a/_/:b` will match the hash path
   * `/hello/_/location` and returns the object `{a: 'hello', b: 'location'}`.
   *
   * @param matcher The matcher string.
   * @return Object containing the matches if it matches, or null otherwise.
   */
  getMatches(matcher: string): {[key: string]: string} | null {
    let matcherParts = this.getParts_(matcher);
    let hashParts = this.getParts_(this.location_.hash.substr(1));

    let matches = {};
    for (let i = 0; i < matcherParts.length; i++) {
      let matchPart = matcherParts[i];
      let hashPart = hashParts[i];

      let matcherResult = LocationService.MATCHER_REGEXP.exec(matchPart);

      if (matcherResult !== null) {
        matches[matcherResult[1]] = hashPart;
      } else if (hashPart !== matchPart) {
        return null;
      }
    }

    return matches;
  }

  /**
   * Navigates to the given path.
   *
   * @param path Path to navigate to.
   */
  goTo(path: string): void {
    this.location_.hash = LocationService.normalizePath(path);
  }

  /**
   * @param matcher Matcher to determine if there is a match.
   * @return True iff the given matcher matches the current path.
   */
  hasMatch(matcher: string): boolean {
    return this.getMatches(matcher) !== null;
  }

  /**
   * Appends the given parts to a single part.
   *
   * @param parts Parts to be joined.
   * @return The joined parts.
   */
  static appendParts(parts: string[]): string {
    let path = Arrays
        .of(parts)
        .filter((part: string) => {
          return part !== '.';
        })
        .map((part: string) => {
          return LocationService.normalizePath(part);
        })
        .asArray()
        .join('');
    return path === '' ? '/' : path;
  }

  /**
   * @return The normalized path. This makes sure that every part starts with a '/' and does not end
   *    with a '/'.
   */
  static normalizePath(path: string): string {
    path = path[0] === '/' ? path : '/' + path;
    return path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path;
  }
}
