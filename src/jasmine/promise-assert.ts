import { AnyAssert } from '../jasmine/any-assert';

export class PromiseAssert<T> extends AnyAssert<Promise<T>> {
  constructor(
      private readonly promise_: Promise<T>,
      private readonly fail_: (message: any) => void,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers<Promise<T>>) {
    super(promise_, reversed, expect);
    if (reversed) {
      throw new Error('Reversed is not supported for Promise asserts');
    }
  }

  async reject(): Promise<any> {
    try {
      await this.promise_;
      return this.fail_(`Expected to reject`);
    } catch (e) {
      return e;
    }
  }

  async rejectWithError(errorMsg: RegExp): Promise<Error> {
    return this.rejectWithErrorType<Error>(Error, errorMsg);
  }

  async rejectWithErrorType<E extends Error>(errorType: gs.ICtor<E>, errorMsg: RegExp): Promise<E> {
    try {
      await this.promise_;
      return this.fail_(`Expected to reject with "${errorMsg}`) as any;
    } catch (e) {
      this.getMatchers_(e).toEqual(jasmine.any(errorType));

      const error = e as E;
      this.getMatchers_(error.message).toMatch(errorMsg);
      return error;
    }
  }

  /**
   * @param expected The expected value to resolve with.
   * @return Promise that will be resolved with the resolved value.
   */
  async resolveWith(expected: T): Promise<T> {
    const resolveValue = await this.promise_;
    this.getMatchers_(resolveValue).toEqual(expected);
    return resolveValue;
  }
}
