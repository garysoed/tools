import { Environment } from 'gs-testing/export/main';
import { Flags, TRACKED_DISPOSABLES } from '../base-disposable';
import { Disposable } from '../disposable';

/**
 * @hidden
 */
const DISPOSABLES: Disposable[] = [];

/**
 * Test setup object for testing any code using code from the `dispose` directory.
 *
 * This checks that all [[BaseDisposable]] objects are disposed at the end of the test. Objects that
 * need to be disposed manually (because they should be disposed through some flow not covered by
 * the test) can be disposed by using the [[add]] method.
 */
class TestDisposeImpl implements Environment {
  /**
   * Adds the given disposables to be disposed at the end of the test.
   * @param ...disposables Disposables to be disposed at the end of the test.
   */
  add(...disposables: Disposable[]): void {
    disposables.forEach((disposable: Disposable) => {
      DISPOSABLES.push(disposable);
    });
  }

  /**
   * Runs the code in jasmine's `afterEach` logic.
   */
  afterEach(): void {
    DISPOSABLES.forEach((disposable: Disposable) => disposable.dispose());
    Flags.enableTracking = false;

    expect(TRACKED_DISPOSABLES).toEqual([]);

    TRACKED_DISPOSABLES.splice(0, TRACKED_DISPOSABLES.length);
  }

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  beforeEach(): void {
    DISPOSABLES.splice(0, DISPOSABLES.length);
    Flags.enableTracking = true;
  }
}
export const TestDispose = new TestDisposeImpl();