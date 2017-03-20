import { DisposableFunction } from '../dispose/disposable-function';

/**
 * Utility class to generate a fake angular `Scope` object.
 */
class FakeScope {

  /**
   * Creates a fake angular `Scope` object.
   *
   * This overrides `$on` and `$watch` to return a deregister function that makes sure that it is
   * called by the end of the test. This uses the [[DisposableFunction]] mechanism. So to enable
   * this check, you will need to setup [[TestDispose]].
   *
   * @return The fake Angular Scope object.
   */
  static create(): any {
    return {
      $apply(): void {
        return undefined;
      },

      $emit(): void {
        return undefined;
      },

      $on(): (() => void) {
        let disposableFunction = new DisposableFunction(() => undefined);
        return () => {
          disposableFunction.dispose();
        };
      },

      $watch(): (() => void) {
        let disposableFunction = new DisposableFunction(() => undefined);
        return () => {
          disposableFunction.dispose();
        };
      },
    };
  }
};

export default FakeScope;
