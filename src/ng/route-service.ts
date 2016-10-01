import {BaseDisposable} from '../dispose/base-disposable';
import Cache from '../data/a-cache';
import {DisposableFunction} from '../dispose/disposable-function';
import {Maps} from '../collection/maps';
import {Records} from '../collection/records';


/**
 * The wrapper for Angular's `ngRoute` service.
 */
export class RouteService extends BaseDisposable {
  private $location_: angular.ILocationService;
  private tempParams_: gs.IJson;

  /**
   * @param $location Angular's location service.
   * @param $rootScope The root scope.
   */
  constructor($location: angular.ILocationService, $rootScope: angular.IScope) {
    super();
    this.$location_ = $location;
    this.tempParams_ = {};

    this.addDisposable(
        new DisposableFunction(
            $rootScope.$on('$routeChangeSuccess', this.onRouteChangeSuccess_.bind(this))));
  }

  private onRouteChangeSuccess_(): void {
    Cache.clear(this);
  }

  /**
   * Routing parameters, both in memory only and URL search parameters.
   */
  @Cache()
  getParams(): gs.IJson {
    let searchParams = Records.of(this.$location_.search())
        .mapValue((value: string) => {
          return JSON.parse(value);
        })
        .asMap();
    return Records.of(this.tempParams_)
        .addAllMap(searchParams)
        .asRecord();
  }

  /**
   * Current routing path.
   */
  getPath(): string {
    return this.$location_.path();
  }

  /**
   * Navigates to the given path.
   * @param path The path to navigate to.
   * @param searchParams Parameters and their values that will be displayed in the URL bar as search
   *    params. The values will be JSON stringified.
   * @param tempParams Other parameters and their values to set.
   */
  to(path: string, searchParams: gs.IJson = {}, tempParams: gs.IJson = {}): void {
    this.tempParams_ = Records.of({})
        .addAllMap(Maps.fromRecord(tempParams).asMap())
        .addAllMap(Maps.fromRecord(searchParams).asMap())
        .asRecord();

    let normalizedSearchParams = Records.of(searchParams)
        .mapValue((value: gs.IJson) => {
          return JSON.stringify(value);
        })
        .asRecord();
    this.$location_.path(path);
    this.$location_.search(normalizedSearchParams);
  }
}

/**
 * An enhanced version of Angular's `ngRoute` service.
 *
 * This adds an in memory parameter. When navigating, you can set parameters that affect the URL
 * search parameters, or just the in memory parameter.
 *
 * For example:
 *
 * ```typescript
 * import RouteService from './ng/route-service';
 *
 * // Navigates to "/path?param1=value"
 * RouteService.to('/path', {'param1': 'value'}, {'param2': 'value'});
 *
 * expect(RouteService.params).toEqual({
 *   'param1': 'value',
 *   'param2': 'value',  // You can still get this even though it is not in the URL
 * });
 * ```
 */
const NgModule = angular
    .module('gsTools.ng.RouteService', ['ngRoute'])
    .service('gsRouteService', RouteService);
export default NgModule;
