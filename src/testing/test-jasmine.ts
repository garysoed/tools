/**
 * Test setup object for using jasmine.
 *
 * This introduces new utility methods for jasmine, such as:
 *
 * -   `calls.firstArgsMatching`: The input parameters are exactly the same as
 *     `toHaveBeenCalledWith`. This returns the first arguments that matches the input parameters.
 */
export const TestJasmine = {
  /**
   * Runs the code in jasmine's `afterEach` logic.
   */
  afterEach(): void {},

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  beforeEach(): void {},

  init(): void {
    function runTest(origRun: any, description: string, callback: (done: any) => any): void {
      if (callback.length === 1) {
        origRun(description, (done: any) => {
          let promise = callback(done);
          if (promise instanceof Promise) {
            promise.then(done, done.fail);
          }
        });
      } else {
        origRun(description, callback);
      }
    };

    window['fit'] = runTest.bind(window, fit);
    window['it'] = runTest.bind(window, it);
  },
};
