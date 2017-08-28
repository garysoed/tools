import { Bus, ListenableDom } from '../event';
import { ImmutableList, ImmutableMap } from '../immutable';
import { LocationServiceEvents } from '../ui/location-service-events';
import { Locations } from '../ui/locations';
import { Log, Reflect } from '../util';

// TODO: DELETE

type LocationServiceEvent = { type: LocationServiceEvents };

const LOGGER = Log.of('gs-tools.ui.LocationService');

/**
 * Service to manage location on a page.
 *
 * This only uses the location's hash.
 */
export class LocationServiceImpl extends Bus<LocationServiceEvents, LocationServiceEvent> {
  private location_: Location;
  private window_: ListenableDom<Window>;

  /**
   * @param window Reference to the window object.
   */
  constructor(window: Window) {
    super(LOGGER);

    this.location_ = window.location;
    this.window_ = ListenableDom.of(window);

    this.addDisposable(this.window_);
  }

  /**
   * Initializes the given LocationService instance.
   * @param service The service instance to be initialized.
   */
  [Reflect.__initialize](): void {
    this.addDisposable(this.window_.on('hashchange', this.onHashChange_, this));
  }

  /**
   * Appends the given parts to a single part.
   *
   * @param parts Parts to be joined.
   * @return The joined parts.
   */
  appendParts(parts: ImmutableList<string>): string {
    const list = parts
        .filter((part: string) => {
          return part !== '.';
        })
        .map((part: string) => {
          return Locations.normalizePath(part);
        });
    const path = [...list].join('');
    return path === '' ? '/' : path;
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
  getMatches(matcher: string): ImmutableMap<string, string> | null {
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
   * Handles event when the hash has been changed.
   */
  private onHashChange_(): void {
    this.dispatch({type: LocationServiceEvents.CHANGED});
  }
}

export const LocationService: LocationServiceImpl =
    Reflect.construct(LocationServiceImpl, [window]);
