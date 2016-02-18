/**
 * #fileoverview Executes the given function when disposed.
 */
import BaseDisposable from './base-disposable';


export default class DisposableFunction extends BaseDisposable {
  private fn_: Function;

  constructor(fn: Function) {
    super();
    this.fn_ = fn;
  }

  /**
   * @override
   */
  disposeInternal(): void {
    this.run();
  }

  run(): void {
    this.fn_();
  }
}
