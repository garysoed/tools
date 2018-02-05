import { Iterables } from '../../immutable';
import { ITestSetup, Matcher, matcherTestSetup } from '../../testing';

export class IterableMatcher<T> implements Matcher {
  static readonly testSetup: ITestSetup = matcherTestSetup(IterableMatcher);

  constructor(private readonly expected_: Iterable<T>) { }

  matches(target: any): boolean {
    if (!target[Symbol.iterator]) {
      return false;
    }

    return Iterables.unsafeEquals(this.expected_, target);
  }

  static of<T>(iterable: Iterable<T>): Iterable<T> {
    return new IterableMatcher<T>(iterable) as any as Iterable<T>;
  }
}
