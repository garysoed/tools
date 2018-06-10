import { Interval } from '../async/interval';
import { cache } from '../data/cache';
import { BaseListener } from '../event/base-listener';

/**
 * A waiter that keeps pinging the given check function to see when to stop waiting.
 *
 * Once the check function returns true, the promise that the waiter keeps will be resolved. If the
 * waiter is disposed before the check function calls true, the promise will be rejected.
 */
export class WaitUntil extends BaseListener {
  private readonly checkFn_: () => boolean;
  private readonly interval_: number;

  /**
   * @param checkFn The function that returns true to tell the waiter to stop waiting and resolve
   *    the promise.
   * @param interval The time, in millis, between each call to the checkFn.
   */
  constructor(checkFn: () => boolean, interval: number) {
    super();
    this.checkFn_ = checkFn;
    this.interval_ = interval;
  }

  /**
   * Promise that will be resolved when the check function has returned true.
   */
  @cache()
  async getPromise(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: any) => void) => {
      const interval = new Interval(this.interval_);
      this.addDisposable(interval);
      this.addDisposable(interval.on(
          'tick',
          () => this.onTick_(interval, resolve, reject),
          this));
      interval.start();
    });
  }

  private onTick_(interval: Interval, resolve: () => void, reject: (error: Error) => void): void {
    if (this.isDisposed()) {
      reject(new Error('Check function has not returned true when waiter is disposed'));
    } else if (this.checkFn_()) {
      interval.dispose();
      resolve();
    }
  }
}

