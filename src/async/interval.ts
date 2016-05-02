import Asserts from '../assert/asserts';
import BaseListenable from '../event/base-listenable';

/**
 * Events dispatched by [[Interval]].
 */
export enum EventType {
  /**
   * Called at every interval.
   */
  TICK
}


/**
 * Wrapper around `window.setInterval`.
 *
 * To use this:
 *
 * 1.  Create a new instance using the [[newInstance]] method.
 * 1.  Listen to the `TICK` [[EventType]].
 * 1.  Call [[start]] to start the interval.
 * 1.  You can stop the interval using the [[stop]] method or just [[dispose]] it.
 */
class Interval extends BaseListenable<EventType> {
  private interval_: number;
  private intervalId_: number;

  /**
   * Use [[newInstance]] for better testability.
   *
   * @param interval Time between each tick, in millis.
   */
  constructor(interval: number) {
    super();
    this.interval_ = interval;
    this.intervalId_ = null;
  }

  /**
   * @override
   */
  disposeInternal(): void {
    super.disposeInternal();
    this.stop();
  }

  /**
   * Starts the interval.
   */
  start(): void {
    Asserts.any(this.intervalId_).to.beEqual(null)
        .orThrows('Interval is already running, cannot start again');
    this.intervalId_ = window.setInterval(() => {
      this.dispatch(EventType.TICK);
    }, this.interval_);
  }

  /**
   * Stops the interval.
   */
  stop(): void {
    if (this.intervalId_ !== null) {
      window.clearInterval(this.intervalId_);
      this.intervalId_ = null;
    }
  }

  /**
   * Creates a new interval.
   *
   * @param interval Time between each tick, in millis.
   */
  static newInstance(interval: number): Interval {
    return new Interval(interval);
  }
}

export default Interval;
