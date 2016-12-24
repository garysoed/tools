import {Interval} from 'src/async/interval';
import {BaseDisposable} from 'src/dispose/base-disposable';


/**
 * A waiter that keeps pinging the given check function to see when to stop waiting.
 *
 * Once the check function returns true, the promise that the waiter keeps will be resolved. If the
 * waiter is disposed before the check function calls true, the promise will be rejected.
 */
class WaitUntil extends BaseDisposable {
  private checkFn_: () => boolean;
  private interval_: number;
  private promise_: Promise<void>;

  /**
   * @param checkFn The function that returns true to tell the waiter to stop waiting and resolve
   *    the promise.
   * @param interval The time, in millis, between each call to the checkFn.
   */
  constructor(checkFn: () => boolean, interval: number) {
    super();
    this.checkFn_ = checkFn;
    this.interval_ = interval;
    this.promise_ = new Promise<void>(this.promiseHandler_.bind(this));
  }

  private promiseHandler_(resolve: () => void, reject: (error: any) => void): void {
    let interval = Interval.newInstance(this.interval_);
    this.addDisposable(interval);
    interval
        .on(
            Interval.TICK_EVENT,
            () => {
              if (this.isDisposed()) {
                reject('Check function has not returned true when waiter is disposed');
              }

              if (this.checkFn_()) {
                interval.dispose();
                resolve();
              }
            },
            this);
    interval.start();
  }

  /**
   * Promise that will be resolved when the check function has returned true.
   */
  getPromise(): Promise<void> {
    return this.promise_;
  }

  /**
   * Creates a new instance of WaitUntil.
   *
   * @param checkFn The function that returns true to tell the waiter to stop waiting and resolve
   *    the promise.
   * @param interval The time, in millis, between each call to the checkFn. Defaults to 100ms.
   */
  static newInstance(checkFn: () => boolean, interval: number = 100): WaitUntil {
    return new WaitUntil(checkFn, interval);
  }
}

export default WaitUntil;
