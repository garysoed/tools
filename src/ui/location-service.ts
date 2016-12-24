import {Arrays} from 'src/collection/arrays';
import {BaseListenable} from 'src/event/base-listenable';
import {DomEvent} from 'src/event/dom-event';
import {ListenableDom} from 'src/event/listenable-dom';
import {Reflect} from 'src/util/reflect';

import {LocationServiceEvents} from './location-service-events';
import {Locations} from './locations';


/**
 * Service to manage location on a page.
 *
 * This only uses the location's hash.
 */
export class LocationService extends BaseListenable<LocationServiceEvents> {
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
   */
  private [Reflect.__initialize](service: LocationService): void {
    this.addDisposable(this.window_.on(DomEvent.HASHCHANGE, this.onHashChange_, this));
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
    return Locations.getMatches(this.getPath(), matcher);
  }

  getPath(): string {
    return Locations.normalizePath(this.location_.hash.substr(1));
  }

  /**
   * Navigates to the given path.
   *
   * @param path Path to navigate to.
   */
  goTo(path: string): void {
    this.location_.hash = Locations.normalizePath(path);
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
          return Locations.normalizePath(part);
        })
        .asArray()
        .join('');
    return path === '' ? '/' : path;
  }
}
