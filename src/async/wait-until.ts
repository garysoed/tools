import { Interval } from '../async/interval';
import { BaseListener } from '../event/base-listener';


/**
 * A waiter that keeps pinging the given check function to see when to stop waiting.
 *
 * Once the check function returns true, the promise that the waiter keeps will be resolved. If the
 * waiter is disposed before the check function calls true, the promise will be rejected.
 */
class WaitUntil extends BaseListener {
  private readonly checkFn_: () => boolean;
  private readonly interval_: number;
  private promise_: Promise<void> | null;

  /**
   * @param checkFn The function that returns true to tell the waiter to stop waiting and resolve
   *    the promise.
   * @param interval The time, in millis, between each call to the checkFn.
   */
  constructor(checkFn: () => boolean, interval: number) {
    super();
    this.checkFn_ = checkFn;
    this.interval_ = interval;
    this.promise_ = null;
  }

  /**
   * Promise that will be resolved when the check function has returned true.
   */
  getPromise(): Promise<void> {
    if (this.promise_ !== null) {
      return this.promise_;
    }
    const promise = new Promise<void>((resolve: () => void, reject: (error: any) => void) => {
      const interval = Interval.newInstance(this.interval_);
      this.addDisposable(interval);
      this.listenTo(
          interval,
          Interval.TICK_EVENT,
          this.onTick_.bind(this, interval, resolve, reject));
      interval.start();
    });
    this.promise_ = promise;
    return promise;
  }

  private onTick_(interval: Interval, resolve: () => void, reject: (error: Error) => void): void {
    if (this.isDisposed()) {
      reject(new Error('Check function has not returned true when waiter is disposed'));
    } else if (this.checkFn_()) {
      interval.dispose();
      resolve();
    }
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
// TODO: Mutable
