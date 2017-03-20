import { AnyAssert } from './any-assert';


export class FunctionAssert<T extends Function> extends AnyAssert<T> {
  /**
   * @param functionValue_ The value to assert.
   * @param reversed_ True iff the assertion logic should be reversed.
   * @param expect_ Reference to jasmine's expect function.'
   */
  constructor(
      private functionValue_: T,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(functionValue_, reversed, expect);
  }

  /**
   * Checks that the given function has been called.
   */
  haveBeenCalled(): void {
    this.getMatchers_().toHaveBeenCalled();
  }

  /**
   * Checks that the given function has been called with the given arguments.
   */
  get haveBeenCalledWith(): T {
    return <T> <any> ((...args: any[]) => {
      let matchers = this.getMatchers_();
      matchers.toHaveBeenCalledWith.apply(matchers, args);
    });
  }

  /**
   * Checks that invoking the given function will throw an error.
   */
  throw(): void {
    this.getMatchers_().toThrow();
  }

  /**
   * Checks that invoking the given function will throw error with message matching the given
   * Regexp.
   *
   * @param regexp Regular expression that the error message should match.
   */
  throwError(regexp: RegExp): void {
    this.getMatchers_().toThrowError(regexp);
  }
}
