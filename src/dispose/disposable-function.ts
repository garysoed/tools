import { DisposableFunction as IDisposableFunction } from '../interfaces/disposable-function';

import { BaseDisposable } from './base-disposable';

/**
 * Wrapper around a function that executes the function when this object is disposed.
 */
export class DisposableFunction extends BaseDisposable implements IDisposableFunction {
  /**
   * @param fn Function to execute when this object is disposed.
   */
  constructor(private readonly fn_: () => void) {
    super();
  }

  disposeInternal(): void {
    this.run();
  }

  /**
   * Runs the inner function.
   */
  run(): void {
    this.fn_();
  }

  static of(fn: () => void): DisposableFunction {
    return new DisposableFunction(fn);
  }
}
