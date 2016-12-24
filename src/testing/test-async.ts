import Asyncs from 'src/async/asyncs';


/**
 * Test setup object for testing any code using code from the `async` directory.
 *
 * This replaces `Asyncs.run` to run synchronously to make testing easier.
 */
export const TestAsync = {
  /**
   * Runs the code in jasmine's `afterEach` logic.
   */
  afterEach(): void {
    // Noop
  },

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  beforeEach(): void {
    spyOn(Asyncs, 'run').and.callFake((fn: () => any) => {
      return fn();
    });
  },
};
