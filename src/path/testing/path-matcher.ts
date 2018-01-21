import { Path } from '../../path';
import { ITestSetup } from '../../testing';

export class PathMatcher {
  static readonly testSetup: ITestSetup = {
    afterEach(): void {},

    beforeEach(): void {
      jasmine.addCustomEqualityTester((first: any, second: any): boolean | undefined => {
        if (first instanceof PathMatcher) {
          return first.matches(second);
        }

        if (second instanceof PathMatcher) {
          return second.matches(first);
        }

        return undefined;
      });
    },

    init(): void {},
  };

  constructor(private readonly pathString_: string) { }

  matches(other: any): boolean {
    if (!(other instanceof Path)) {
      return false;
    }

    return other.toString() === this.pathString_;
  }

  static with(pathString: string): any {
    return new PathMatcher(pathString);
  }
}
