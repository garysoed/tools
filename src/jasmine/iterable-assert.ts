import { AnyAssert } from './any-assert';


export class IterableAssert<T> extends AnyAssert<Iterable<T>> {
  /**
   * @param iterableValue_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private iterableValue_: Iterable<T>,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers<Iterable<T>>) {
    super(iterableValue_, reversed, expect);
  }

  startWith(expected: T[]): void {
    const iterator = this.iterableValue_[Symbol.iterator]();

    // Collect the first few elements of the iterator.
    const toCheck: T[] = [];
    let result = iterator.next();
    for (const _ of expected) {
      if (result.done) {
        break;
      }

      toCheck.push(result.value);
      result = iterator.next();
    }
    this.getMatchers_(toCheck).toEqual(expected);
  }
}
// TODO: Mutable
