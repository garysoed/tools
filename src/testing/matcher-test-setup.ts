import { ITestSetup } from '../testing/i-test-setup';
import { Matcher } from '../testing/matcher';

export function matcherTestSetup(ctor: gs.ICtor<Matcher>): ITestSetup {
  return {
    afterEach(): void {},

    beforeEach(): void {
      jasmine.addCustomEqualityTester((first: any, second: any): boolean | undefined => {
        if (first instanceof ctor) {
          return first.matches(second);
        }

        if (second instanceof ctor) {
          return second.matches(first);
        }

        return undefined;
      });
    },

    init(): void {},
  };
}
