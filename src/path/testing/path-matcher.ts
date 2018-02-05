import { Path } from '../../path';
import { ITestSetup, Matcher, matcherTestSetup } from '../../testing';

export class PathMatcher implements Matcher {
  static readonly testSetup: ITestSetup = matcherTestSetup(PathMatcher);

  constructor(private readonly pathString_: string) { }

  matches(other: any): boolean {
    if (!(other instanceof Path)) {
      return false;
    }

    return other.toString() === this.pathString_;
  }

  static with(pathString: string): Path {
    return new PathMatcher(pathString) as any as Path;
  }
}
