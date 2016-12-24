import {BaseDisposable} from 'src/dispose/base-disposable';


/**
 * Base class of all Angular components.
 */
class BaseComponent extends BaseDisposable {
  private $scope_: angular.IScope;

  /**
   * @param $scope Angular $scope object. This should only be used for triggering the digest cycle.
   */
  constructor($scope: angular.IScope) {
    super();
    this.$scope_ = $scope;
  }

  /**
   * Called when the component is destroyed.
   */
  $onDestroy(): void {
    this.dispose();
  }

  /**
   * The $scope object related to this component.
   */
  get$scope(): angular.IScope {
    return this.$scope_;
  }

  /**
   * Triggers the digest cycle.
   */
  triggerDigest(): void {
    this.$scope_.$apply(() => undefined);
  }
}

export default BaseComponent;
