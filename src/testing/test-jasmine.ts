import {BaseDisposable, Flags, TRACKED_DISPOSABLES} from '../dispose/base-disposable';


/**
 * @hidden
 */
const DISPOSABLES = [];


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
  afterEach(): void {
    DISPOSABLES.forEach((disposable: BaseDisposable) => disposable.dispose());
    Flags.enableTracking = false;

    expect(TRACKED_DISPOSABLES).toEqual([]);

    TRACKED_DISPOSABLES.splice(0, TRACKED_DISPOSABLES.length);
  },

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  beforeEach(): void {
    jasmine['CallTracker'].prototype.firstArgsMatching = function(): any {
      // TODO: Deprecate this.
      let matchingArgs = arguments;
      let allArgs = this.allArgs();
      for (let j = 0; j < allArgs.length; j++) {
        let matches = true;
        let args = allArgs[j];
        for (let i = 0; i < args.length; i++) {
          let matchingArg = matchingArgs[i];
          let isEqual = matchingArg === args[i];
          let isMatch = matchingArg.asymmetricMatch instanceof Function
              && matchingArg.asymmetricMatch(args[i]);
          matches = matches && (isEqual || isMatch);
        }

        if (matches) {
          return args;
        }
      }
    };
  },
};
