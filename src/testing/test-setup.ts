import ITestSetup from './i-test-setup';

/**
 * Sets up testing logic for your project.
 *
 * Each directory in `gs-tools` may contain special testing logic. Whenever you use them in your
 * project, you want to install the corresponding test setup file for tests in your project.
 *
 * A recommended way to use this is to create a `test-base.ts` file in your project to set up the
 * `TestSetup` and include the `test-base` in every test. This `test-base` class should install the
 * test setup plugins to use, and call [[setup]] once during the test.
 *
 * Example `test-base` file:
 *
 * ```typescript
 * import TestDispose from './testing/test-dispose';
 * import TestSetup from './testing/test-setup';
 *
 * const testSetup = new TestSetup([TestDispose]);
 * let initialized = false;
 * export default = {
 *   setup() {
 *     if (!initialized) {
 *       testSetup.setup();
 *       initialized = true;
 *     }
 *   }
 * };
 * ```
 *
 * In your test:
 *
 * ```
 * import {TestBase} from 'src/test-base';
 * TestBase.setup();
 *
 * import DisposableClass from './disposable-class';
 * import TestDispose from './testing/test-dispose';
 *
 * describe('Some disposable class', () => {
 *   it('should do something', () => {
 *     let disposableClass = new DisposableClass();
 *
 *     // Without this, TestDispose will complain that disposableClass does not get disposed at the
 *     // end of the test.
 *     TestDispose.add(disposableClass);
 *   });
 * });
 * ```
 */
export class TestSetup {
  private setups_: ITestSetup[];

  constructor(setups: ITestSetup[]) {
    this.setups_ = setups;
  }

  setup(): void {
    beforeEach(() => {
      this.setups_.forEach((setup: ITestSetup) => {
        setup.beforeEach();
      });
    });

    afterEach(() => {
      this.setups_.forEach((setup: ITestSetup) => {
        setup.afterEach();
      });
    });
  }
};
