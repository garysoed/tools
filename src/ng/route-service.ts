import BaseDisposable from '../dispose/base-disposable';
import Cache from '../data/a-cache';
import DisposableFunction from '../dispose/disposable-function';
import Maps from '../collection/maps';
import Records from '../collection/records';

export class RouteService extends BaseDisposable {
  private $location_: angular.ILocationService;
  private tempParams_: gs.IJson;

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

  @Cache()
  get params(): gs.IJson {
    let searchParams = Records.of(this.$location_.search())
        .mapValue((value: string) => {
          return JSON.parse(value);
        })
        .data;
    return Records.of(this.tempParams_)
        .addAll(Maps.fromRecord(searchParams).data)
        .data;
  }

  get path(): string {
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
        .addAll(Maps.fromRecord(tempParams).data)
        .addAll(Maps.fromRecord(searchParams).data)
        .data;

    let normalizedSearchParams = Records.of(searchParams)
        .mapValue((value: gs.IJson) => {
          return JSON.stringify(value);
        })
        .data;
    this.$location_.path(path);
    this.$location_.search(normalizedSearchParams);
  }
}

export default angular
    .module('gsTools.ng.RouteService', ['ngRoute'])
    .service('gsRouteService', RouteService);
