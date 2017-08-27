import { AssertionError } from '../error';
import { Bus } from '../event';
import { Log } from '../util';

export type IntervalEventType = 'tick';
export type IntervalEvent = {type: IntervalEventType};

const LOGGER: Log = Log.of('gs-tools.async.Interval');

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
export class Interval extends Bus<IntervalEventType, IntervalEvent> {
  private intervalId_: (number | null);

  /**
   * Use [[newInstance]] for better testability.
   *
   * @param interval Time between each tick, in millis.
   */
  constructor(private readonly interval_: number) {
    super(LOGGER);
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
    if (this.intervalId_ !== null) {
      throw AssertionError.generic('Interval is already running, cannot start again');
    }
    this.intervalId_ = window.setInterval(() => {
      this.dispatch({type: 'tick'});
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
