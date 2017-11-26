/**
 * Interface to implement for [[TestSetup]] code.
 */
export interface ITestSetup {
  /**
   * Runs the code in jasmine's `afterEach` logic.
   */
  afterEach(): void;

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  beforeEach(): void;

  /**
   * Runs before any of jasmine's logic is called.
   */
  init(): void;
}
