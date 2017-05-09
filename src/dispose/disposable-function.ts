import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction as IDisposableFunction } from '../interfaces/disposable-function';

/**
 * Wrapper around a function that executes the function when this object is disposed.
 */
export class DisposableFunction extends BaseDisposable implements IDisposableFunction {
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

  static of(fn: () => void): DisposableFunction {
    return new DisposableFunction(fn);
  }
}
// TODO: Mutable
