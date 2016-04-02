/// @doc

import BaseDisposable from './base-disposable';

/**
 * Wrapper around a function that executes the function when this object is disposed.
 */
class DisposableFunction extends BaseDisposable {
  private fn_: Function;

  /**
   * @param fn Function to execute when this object is disposed.
   */
  constructor(fn: () => void) {
    super();
    this.fn_ = fn;
  }

  /**
   * @override
   */
  disposeInternal(): void {
    this.run();
  }

  /**
   * Runs the inner function.
   */
  run(): void {
    this.fn_();
  }
}

export default DisposableFunction;
